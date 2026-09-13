// src/hooks/useVaccines.js
// Hooks do TanStack Query para o CRUD de Vacinas, vinculadas a um pet.
// Também expõe os hooks de "lembretes" que consomem diretamente os
// endpoints /api/vaccines/expired e /api/vaccines/due-soon da API.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vaccinesService } from '../services/vaccinesService';

const vaccinesDoPetKey = (petId) => ['vaccines', 'pet', petId];
const VENCIDAS_KEY = ['vaccines', 'expired'];
const A_VENCER_KEY = (dias) => ['vaccines', 'due-soon', dias];

/** Lista as vacinas de um pet específico. */
export function useVaccinesByPet(petId) {
  return useQuery({
    queryKey: vaccinesDoPetKey(petId),
    queryFn: () => vaccinesService.listarPorPet(petId),
    enabled: !!petId,
  });
}

/** Busca uma vacina específica por id (tela de edição). */
export function useVaccine(id) {
  return useQuery({
    queryKey: ['vaccine', id],
    queryFn: () => vaccinesService.buscarPorId(id),
    enabled: !!id,
  });
}

/** Vacinas vencidas (próxima dose no passado) — de TODOS os pets do sistema. */
export function useVaccinesVencidas() {
  return useQuery({
    queryKey: VENCIDAS_KEY,
    queryFn: () => vaccinesService.listarVencidas(),
  });
}

/** Vacinas com dose prevista nos próximos N dias — de TODOS os pets do sistema. */
export function useVaccinesAVencer(dias = 30) {
  return useQuery({
    queryKey: A_VENCER_KEY(dias),
    queryFn: () => vaccinesService.listarAVencer(dias),
  });
}

function invalidarTudoDeVacinas(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['vaccines'] });
}

export function useCreateVaccine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados) => vaccinesService.criar(dados),
    onSuccess: () => invalidarTudoDeVacinas(queryClient),
  });
}

export function useUpdateVaccine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }) => vaccinesService.atualizar(id, dados),
    onSuccess: () => invalidarTudoDeVacinas(queryClient),
  });
}

export function useDeleteVaccine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => vaccinesService.deletar(id),
    onSuccess: () => invalidarTudoDeVacinas(queryClient),
  });
}
