// src/utils/dateUtils.js
// Utilitários de data — a API trabalha com datas SEM fuso horário
// ('AAAA-MM-DD' e 'AAAA-MM-DDTHH:mm:ss'), sempre tratadas como horário local.
// Atenção: `new Date('AAAA-MM-DD')` é interpretado como UTC pelo JS e pode
// "voltar um dia" — por isso sempre passamos por `parseData`.

const MS_DIA = 1000 * 60 * 60 * 24;

/** 'AAAA-MM-DD' → Date (meia-noite local). Retorna null se inválida. */
export function parseData(texto) {
  if (!texto || typeof texto !== 'string') return null;
  const d = new Date(`${texto.slice(0, 10)}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** 'AAAA-MM-DDTHH:mm[:ss]' → Date local. Retorna null se inválida. */
export function parseDataHora(texto) {
  if (!texto || typeof texto !== 'string') return null;
  const d = new Date(texto.length === 16 ? `${texto}:00` : texto);
  return Number.isNaN(d.getTime()) ? null : d;
}

const pad = (n) => String(n).padStart(2, '0');

/** Date → 'AAAA-MM-DD' (local). */
export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 'AAAA-MM-DD' → 'dd/mm/aaaa'. */
export function formatarData(texto) {
  const d = parseData(texto);
  if (!d) return '—';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** 'AAAA-MM-DDTHH:mm:ss' → 'dd/mm/aaaa às HH:mm'. */
export function formatarDataHora(texto) {
  const d = parseDataHora(texto);
  if (!d) return '—';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} às ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Dias inteiros entre hoje (00:00) e a data alvo. Negativo = no passado. */
export function diasAte(alvo, agora = new Date()) {
  if (!alvo) return null;
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const dia = new Date(alvo.getFullYear(), alvo.getMonth(), alvo.getDate());
  return Math.round((dia - hoje) / MS_DIA);
}

/** Idade legível a partir de meses (ex.: 14 → '1 ano e 2m'). */
export function formatarIdade(ageInMonths) {
  if (ageInMonths == null) return null;
  if (ageInMonths < 12) return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
  const anos = Math.floor(ageInMonths / 12);
  const meses = ageInMonths % 12;
  const base = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  return meses > 0 ? `${base} e ${meses}m` : base;
}
