// src/services/appointmentsService.js
// CRUD de Consultas (/api/appointments) — conferido no AppointmentController
// e AppointmentDtos da API Java.
//
// Modelo (AppointmentRequest/Response):
// { id, petId, clinicId, scheduledAt ('AAAA-MM-DDTHH:mm:ss'),
//   type ('VACCINATION'|'CHECKUP'|'SURGERY'|'RETURN'|'EMERGENCY'|'OTHER'),
//   notes, completed }

import api from './api';

export const appointmentsService = {
  /** GET /api/appointments/by-pet/{petId} */
  listarPorPet: async (petId) => (await api.get(`/appointments/by-pet/${petId}`)).data,

  /** GET /api/appointments/pending → consultas futuras não concluídas (todos os pets) */
  listarPendentes: async () => (await api.get('/appointments/pending')).data,

  /** GET /api/appointments/{id} */
  buscarPorId: async (id) => (await api.get(`/appointments/${id}`)).data,

  /** POST /api/appointments */
  criar: async (dados) => (await api.post('/appointments', dados)).data,

  /** PUT /api/appointments/{id} */
  atualizar: async (id, dados) => (await api.put(`/appointments/${id}`, dados)).data,

  /** PUT /api/appointments/{id}/complete */
  concluir: async (id) => (await api.put(`/appointments/${id}/complete`)).data,

  /** DELETE /api/appointments/{id} */
  deletar: (id) => api.delete(`/appointments/${id}`),
};

export default appointmentsService;
