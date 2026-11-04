// src/services/reminderPlanner.js
// REGRAS de lembretes — funções PURAS (sem expo, sem I/O): decidem QUANDO e O QUE
// notificar a partir dos dados da API. Quem efetivamente agenda/dispara é o
// reminderService (via notificationService).
//
// Identificadores determinísticos (ex.: "vacina-12-d1") permitem reagendar o
// mesmo lembrete sem duplicar e cancelar por prefixo.

import { parseData, parseDataHora, formatarData, formatarDataHora, diasAte, toISODate } from '../utils/dateUtils';
import { TIPOS_CONSULTA } from '../constants/appointmentTypes';

const HORA_LEMBRETE_VACINA = 9; // 09:00
const MARGEM_MS = 5000;          // não agenda algo que já "venceu" há segundos

export const idVacina = (id, sufixo) => `vacina-${id}-${sufixo}`;
export const idConsulta = (id, sufixo) => `consulta-${id}-${sufixo}`;

function aindaNoFuturo(quando, agora) {
  return quando.getTime() > agora.getTime() + MARGEM_MS;
}

/** Lembretes de uma vacina: véspera e dia da dose, às 09:00. */
export function planejarLembretesVacina(vacina, nomePet = 'seu pet', agora = new Date()) {
  const dose = parseData(vacina?.nextDoseAt);
  if (!dose) return [];

  const vespera = new Date(dose);
  vespera.setDate(dose.getDate() - 1);
  vespera.setHours(HORA_LEMBRETE_VACINA, 0, 0, 0);
  const diaDose = new Date(dose);
  diaDose.setHours(HORA_LEMBRETE_VACINA, 0, 0, 0);

  const data = { tipo: 'vacina', petId: vacina.petId, vaccineId: vacina.id };
  return [
    {
      id: idVacina(vacina.id, 'd1'),
      quando: vespera,
      titulo: `💉 Vacina amanhã: ${vacina.vaccineName}`,
      corpo: `${nomePet} precisa tomar ${vacina.vaccineName} amanhã (${formatarData(vacina.nextDoseAt)}).`,
      data,
    },
    {
      id: idVacina(vacina.id, 'd0'),
      quando: diaDose,
      titulo: `💉 Vacina hoje: ${vacina.vaccineName}`,
      corpo: `Hoje é o dia da dose de ${vacina.vaccineName} de ${nomePet}. Não esqueça!`,
      data,
    },
  ].filter((l) => aindaNoFuturo(l.quando, agora));
}

/** Lembretes de uma consulta: 24h e 1h antes. */
export function planejarLembretesConsulta(consulta, nomePet = 'seu pet', agora = new Date()) {
  if (!consulta || consulta.completed) return [];
  const quando = parseDataHora(consulta.scheduledAt);
  if (!quando) return [];

  const tipo = TIPOS_CONSULTA[consulta.type]?.label || 'Consulta';
  const umDiaAntes = new Date(quando.getTime() - 24 * 60 * 60 * 1000);
  const umaHoraAntes = new Date(quando.getTime() - 60 * 60 * 1000);
  const data = { tipo: 'consulta', petId: consulta.petId, appointmentId: consulta.id };

  return [
    {
      id: idConsulta(consulta.id, '24h'),
      quando: umDiaAntes,
      titulo: `🩺 Consulta amanhã: ${tipo}`,
      corpo: `${nomePet} tem ${tipo.toLowerCase()} em ${formatarDataHora(consulta.scheduledAt)}.`,
      data,
    },
    {
      id: idConsulta(consulta.id, '1h'),
      quando: umaHoraAntes,
      titulo: `🩺 Consulta em 1 hora: ${tipo}`,
      corpo: `${nomePet} tem ${tipo.toLowerCase()} às ${formatarDataHora(consulta.scheduledAt).split(' às ')[1]}.`,
      data,
    },
  ].filter((l) => aindaNoFuturo(l.quando, agora));
}

/**
 * Resumo exibido ao abrir o app: vacinas atrasadas e itens dos próximos 7 dias.
 * Recebe os itens já montados por `montarLembretes` (com `status` e `quando`).
 * Retorna null se não há nada a avisar. `chave` evita repetir o mesmo aviso no mesmo dia.
 */
export function planejarResumo({ vacinas = [], consultas = [] }, agora = new Date()) {
  const atrasadas = vacinas.filter((v) => v.status?.tone === 'critical');
  const vacinasSemana = vacinas.filter((v) => v.status?.tone === 'warning');
  const consultasSemana = consultas.filter(
    (c) => c.quando && c.quando > agora && diasAte(c.quando, agora) <= 7,
  );

  if (!atrasadas.length && !vacinasSemana.length && !consultasSemana.length) return null;

  const linhas = [
    ...atrasadas.map((v) => `${v.petName}: ${v.vaccineName} (atrasada)`),
    ...vacinasSemana.map((v) => `${v.petName}: ${v.vaccineName} em ${formatarData(v.nextDoseAt)}`),
    ...consultasSemana.map((c) => `${c.petName}: consulta em ${formatarDataHora(c.scheduledAt)}`),
  ];
  const extras = linhas.length > 3 ? ` (+${linhas.length - 3})` : '';

  const titulo = atrasadas.length
    ? `⚠️ ${atrasadas.length} ${atrasadas.length === 1 ? 'vacina atrasada' : 'vacinas atrasadas'}`
    : '🗓️ Lembretes da semana';

  const ids = [...atrasadas, ...vacinasSemana, ...consultasSemana].map((i) => i.key).sort().join(',');
  return {
    chave: `${toISODate(agora)}|${ids}`,
    titulo,
    corpo: `${linhas.slice(0, 3).join(' • ')}${extras}`,
    data: { tipo: 'resumo' },
  };
}
