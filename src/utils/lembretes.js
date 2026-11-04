// src/utils/lembretes.js
// Monta a lista unificada de lembretes do tutor (vacinas + consultas).
//
// Os endpoints /vaccines/expired, /vaccines/due-soon e /appointments/pending
// já devolvem SOMENTE o que o usuário logado pode ver (TUTOR: os próprios pets;
// VET: todos) — o filtro é feito no servidor. A lista de pets serve apenas de
// reserva para o nome do pet quando a resposta não o traz.

import { parseData, parseDataHora } from './dateUtils';
import { statusVacina, statusConsulta } from './statusUtils';

export function montarLembretes({ pets = [], vencidas = [], aVencer = [], consultas = [] }, agora = new Date()) {
  const petsPorId = new Map(pets.map((p) => [p.id, p]));

  const vistos = new Set();
  const vacinas = [...vencidas, ...aVencer]
    .filter((v) => !vistos.has(v.id) && vistos.add(v.id))
    .map((v) => ({
      ...v,
      kind: 'vacina',
      key: `vacina-${v.id}`,
      petName: v.petName || petsPorId.get(v.petId)?.name || 'Pet',
      status: statusVacina(v, agora),
      quando: parseData(v.nextDoseAt),
    }));

  const consultasDoTutor = consultas
    .filter((c) => !c.completed)
    .map((c) => ({
      ...c,
      kind: 'consulta',
      key: `consulta-${c.id}`,
      petName: c.petName || petsPorId.get(c.petId)?.name || 'Pet',
      status: statusConsulta(c, agora),
      quando: parseDataHora(c.scheduledAt),
    }));

  const ordenar = (a, b) => (a.quando?.getTime() ?? 0) - (b.quando?.getTime() ?? 0);

  return {
    petsPorId,
    vacinas: vacinas.sort(ordenar),
    consultas: consultasDoTutor.sort(ordenar),
    todos: [...vacinas, ...consultasDoTutor].sort(ordenar),
    atrasadas: vacinas.filter((v) => v.status?.tone === 'critical').length,
  };
}
