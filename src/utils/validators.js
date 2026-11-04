// src/utils/validators.js
// Regras de validação de formulários — fora das telas, para reuso e clareza.
// Cada função retorna um objeto { campo: 'mensagem' } (vazio = válido).

import { parseData } from './dateUtils';

const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const EMAIL_REGEX = /\S+@\S+\.\S+/;

export const isDataValida = (t) => DATA_REGEX.test(t || '') && parseData(t) !== null;
export const isHoraValida = (t) => HORA_REGEX.test(t || '');

export function validarLogin({ email, senha }) {
  const e = {};
  if (!email.trim()) e.email = 'E-mail é obrigatório.';
  else if (!EMAIL_REGEX.test(email)) e.email = 'E-mail inválido.';
  if (!senha) e.senha = 'Senha é obrigatória.';
  else if (senha.length < 6) e.senha = 'Senha deve ter no mínimo 6 caracteres.';
  return e;
}

export function validarCadastro({ nome, email, telefone, senha, confirmarSenha }) {
  const e = {};
  // Limites iguais aos do TutorRegisterRequest da API (name 2–100, phone 8–20, password 6–72)
  if (!nome.trim()) e.nome = 'Nome completo é obrigatório.';
  else if (nome.trim().length < 2) e.nome = 'Nome deve ter ao menos 2 caracteres.';
  if (!email.trim()) e.email = 'E-mail é obrigatório.';
  else if (!EMAIL_REGEX.test(email)) e.email = 'E-mail inválido.';
  if (!telefone.trim()) e.telefone = 'Telefone é obrigatório.';
  else if (telefone.trim().length < 8 || telefone.trim().length > 20) e.telefone = 'Telefone deve ter entre 8 e 20 caracteres.';
  if (!senha) e.senha = 'Senha é obrigatória.';
  else if (senha.length < 6) e.senha = 'Senha deve ter no mínimo 6 caracteres.';
  else if (senha.length > 72) e.senha = 'Senha deve ter no máximo 72 caracteres.';
  if (senha !== confirmarSenha) e.confirmarSenha = 'As senhas não coincidem.';
  return e;
}

/** Regras do PetRequest da API: nome, nascimento (não futuro) e peso (> 0) são obrigatórios. */
export function validarPet({ name, birthDate, weightKg }, agora = new Date()) {
  const e = {};
  if (!name.trim()) e.name = 'O nome do pet é obrigatório.';
  if (!birthDate.trim()) e.birthDate = 'A data de nascimento é obrigatória.';
  else if (!isDataValida(birthDate)) e.birthDate = 'Use o formato AAAA-MM-DD.';
  else if (parseData(birthDate) > agora) e.birthDate = 'A data de nascimento não pode ser futura.';
  if (!String(weightKg).trim()) e.weightKg = 'O peso é obrigatório.';
  else {
    const peso = Number(String(weightKg).replace(',', '.'));
    if (Number.isNaN(peso)) e.weightKg = 'Peso inválido.';
    else if (peso <= 0) e.weightKg = 'Peso deve ser maior que zero.';
  }
  return e;
}

export function validarVacina({ vaccineName, appliedAt, nextDoseAt }) {
  const e = {};
  if (!vaccineName.trim()) e.vaccineName = 'O nome da vacina é obrigatório.';
  if (!appliedAt.trim()) e.appliedAt = 'A data de aplicação é obrigatória.';
  else if (!isDataValida(appliedAt)) e.appliedAt = 'Use o formato AAAA-MM-DD.';
  if (!nextDoseAt.trim()) e.nextDoseAt = 'A data da próxima dose é obrigatória.';
  else if (!isDataValida(nextDoseAt)) e.nextDoseAt = 'Use o formato AAAA-MM-DD.';
  else if (isDataValida(appliedAt) && nextDoseAt <= appliedAt) {
    e.nextDoseAt = 'A próxima dose deve ser posterior à data de aplicação.';
  }
  return e;
}

// A API exige data/hora FUTURA tanto ao agendar quanto ao editar (@Future no AppointmentRequest).
export function validarConsulta({ clinicId, data, hora }, { exigirFuturo = true } = {}) {
  const e = {};
  if (!clinicId) e.clinicId = 'Selecione a clínica.';
  if (!data.trim()) e.data = 'A data é obrigatória.';
  else if (!isDataValida(data)) e.data = 'Use o formato AAAA-MM-DD.';
  if (!hora.trim()) e.hora = 'O horário é obrigatório.';
  else if (!isHoraValida(hora)) e.hora = 'Use o formato HH:MM (24h).';
  if (!e.data && !e.hora && exigirFuturo) {
    if (new Date(`${data}T${hora}:00`) <= new Date()) {
      e.data = 'Agende para uma data/horário futuro.';
    }
  }
  return e;
}
