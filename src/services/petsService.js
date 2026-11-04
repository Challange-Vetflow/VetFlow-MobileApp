// src/services/petsService.js
// CRUD de Pets (/api/pets) — conferido no PetController/PetDtos da API (Sprint 4).
//
// PetRequest:  { name, species, breed, birthDate 'AAAA-MM-DD', weightKg (>0, obrigatório), tutorId? }
//              (TUTOR: a API ignora tutorId e usa o do usuário logado)
// PetResponse: { id (UUID), name, species ('DOG'|'CAT'|'BIRD'|'RABBIT'|'OTHER'), breed,
//                birthDate, weightKg, ageInMonths, tutorId, tutorName, active }
// Exclusão é LÓGICA no servidor (o pet some das listagens).

import api, { extractContent } from './api';

export const petsService = {
  /** GET /api/pets/by-tutor/{tutorId} → PetResponse[] (só o próprio tutor pode consultar) */
  listarPorTutor: async (tutorId) => (await api.get(`/pets/by-tutor/${tutorId}`)).data,

  /**
   * GET /api/pets?page&size → PageResponse<PetResponse>. TUTOR recebe só os próprios;
   * VET recebe todos. A API limita size a 100.
   */
  listarTodos: async ({ size = 100, sort = 'name', direction = 'asc' } = {}) => {
    const response = await api.get('/pets', { params: { page: 0, size, sort, direction } });
    return extractContent(response.data);
  },

  /** GET /api/pets/{id} */
  buscarPorId: async (id) => (await api.get(`/pets/${id}`)).data,

  /** POST /api/pets */
  criar: async (dados) => (await api.post('/pets', dados)).data,

  /** PUT /api/pets/{id} */
  atualizar: async (id, dados) => (await api.put(`/pets/${id}`, dados)).data,

  /** DELETE /api/pets/{id} → 204 (exclusão lógica) */
  deletar: (id) => api.delete(`/pets/${id}`),
};

export default petsService;
