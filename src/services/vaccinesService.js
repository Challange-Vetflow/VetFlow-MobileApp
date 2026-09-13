// src/services/vaccinesService.js
// CRUD de Vacinas (/api/vaccines) — endpoints e campos conferidos no
// VaccineController e VaccineDtos da API Java real do grupo.
//
// Modelo (VaccineRequest/VaccineResponse):
// { id, petId, vaccineName, appliedAt ('AAAA-MM-DD'), nextDoseAt ('AAAA-MM-DD'),
//   batch, expired }
//
// A API já expõe endpoints prontos para "lembretes" (due-soon / expired),
// usados nas telas de Início e Lembretes em vez de recalcular tudo no app.

import api from './api';

export const vaccinesService = {
  /** GET /api/vaccines/by-pet/{petId} → VaccineResponse[] */
  listarPorPet: async (petId) => {
    const response = await api.get(`/vaccines/by-pet/${petId}`);
    return response.data;
  },

  /** GET /api/vaccines/{id} */
  buscarPorId: async (id) => {
    const response = await api.get(`/vaccines/${id}`);
    return response.data;
  },

  /** GET /api/vaccines/expired → vacinas com próxima dose no passado (todos os pets) */
  listarVencidas: async () => {
    const response = await api.get('/vaccines/expired');
    return response.data;
  },

  /** GET /api/vaccines/due-soon?days=N → vacinas com dose nos próximos N dias */
  listarAVencer: async (dias = 30) => {
    const response = await api.get('/vaccines/due-soon', { params: { days: dias } });
    return response.data;
  },

  /** POST /api/vaccines */
  criar: async (dados) => {
    const response = await api.post('/vaccines', dados);
    return response.data;
  },

  /** PUT /api/vaccines/{id} */
  atualizar: async (id, dados) => {
    const response = await api.put(`/vaccines/${id}`, dados);
    return response.data;
  },

  /** DELETE /api/vaccines/{id} */
  deletar: (id) => api.delete(`/vaccines/${id}`),
};

export default vaccinesService;
