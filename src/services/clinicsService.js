// src/services/clinicsService.js
// Clínicas (/api/clinics) — usadas para escolher onde a consulta será feita.
// Modelo (ClinicResponse): { id, name, address, phone, ... }

import api from './api';

export const clinicsService = {
  /** GET /api/clinics → ClinicResponse[] */
  listar: async () => (await api.get('/clinics')).data,
};

export default clinicsService;
