// src/hooks/useClinics.js
// Clínicas disponíveis para agendamento (GET /api/clinics).

import { useQuery } from '@tanstack/react-query';
import { clinicsService } from '../services/clinicsService';

export function useClinics() {
  return useQuery({
    queryKey: ['clinics'],
    queryFn: () => clinicsService.listar(),
    staleTime: 1000 * 60 * 10, // clínicas mudam pouco
  });
}
