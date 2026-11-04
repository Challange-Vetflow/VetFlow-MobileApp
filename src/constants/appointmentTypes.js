// src/constants/appointmentTypes.js
// Tipos de consulta (enum AppointmentType da API Java) com rótulo e ícone.

export const TIPOS_CONSULTA = {
  CHECKUP: { label: 'Check-up', icon: 'clipboard' },
  VACCINATION: { label: 'Vacinação', icon: 'shield' },
  RETURN: { label: 'Retorno', icon: 'rotate-ccw' },
  SURGERY: { label: 'Cirurgia', icon: 'scissors' },
  EMERGENCY: { label: 'Emergência', icon: 'alert-triangle' },
  OTHER: { label: 'Outro', icon: 'more-horizontal' },
};

export const LISTA_TIPOS_CONSULTA = Object.entries(TIPOS_CONSULTA).map(([value, cfg]) => ({ value, ...cfg }));
