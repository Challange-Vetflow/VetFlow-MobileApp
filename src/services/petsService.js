// src/services/petsService.js
// CRUD de Pets (/api/pets) — endpoints e campos conferidos no PetController
// e PetDtos da API Java real do grupo.
//
// Modelo (PetRequest/PetResponse):
// { id, name, species ('DOG'|'CAT'|'BIRD'|'RABBIT'|'OTHER'), breed,
//   birthDate ('AAAA-MM-DD'), weightKg, tutorId, ageInMonths, active }

import api from './api';

export const petsService = {
  /** GET /api/pets/by-tutor/{tutorId} → PetResponse[] (só os pets do tutor logado) */
  listarPorTutor: async (tutorId) => {
    const response = await api.get(`/pets/by-tutor/${tutorId}`);
    return response.data;
  },

  /** GET /api/pets/{id} */
  buscarPorId: async (id) => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  },

  /** POST /api/pets */
  criar: async (dados) => {
    const response = await api.post('/pets', dados);
    return response.data;
  },

  /** PUT /api/pets/{id} */
  atualizar: async (id, dados) => {
    const response = await api.put(`/pets/${id}`, dados);
    return response.data;
  },

  /** DELETE /api/pets/{id} */
  deletar: (id) => api.delete(`/pets/${id}`),
};

export default petsService;
