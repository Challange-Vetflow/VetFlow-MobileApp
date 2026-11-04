// src/utils/statusUtils.js
// Regras de status de lembretes (vacinas e consultas). Retornam um "tom"
// semântico ('critical' | 'warning' | 'success'); quem renderiza converte o
// tom em cor da paleta ativa (claro/escuro).

import { parseData, parseDataHora, diasAte } from './dateUtils';

/** Status da próxima dose de uma vacina (usa o campo `expired` da API). */
export function statusVacina(vacina, agora = new Date()) {
  if (!vacina?.nextDoseAt) return null;
  if (vacina.expired) return { label: 'Atrasada', tone: 'critical' };
  const dias = diasAte(parseData(vacina.nextDoseAt), agora);
  if (dias === null) return null;
  if (dias < 0) return { label: 'Atrasada', tone: 'critical' };
  if (dias <= 7) return { label: 'Esta semana', tone: 'warning' };
  return { label: 'Em dia', tone: 'success' };
}

/** Status de uma consulta agendada. */
export function statusConsulta(consulta, agora = new Date()) {
  if (!consulta?.scheduledAt) return null;
  if (consulta.completed) return { label: 'Concluída', tone: 'success' };
  const quando = parseDataHora(consulta.scheduledAt);
  if (!quando) return null;
  if (quando < agora) return { label: 'Atrasada', tone: 'critical' };
  const dias = diasAte(quando, agora);
  if (dias === 0) return { label: 'Hoje', tone: 'warning' };
  if (dias <= 7) return { label: 'Esta semana', tone: 'warning' };
  return { label: 'Agendada', tone: 'success' };
}
