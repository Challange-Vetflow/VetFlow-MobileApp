// src/hooks/usePets.js
// Hooks do TanStack Query para o CRUD de Pets, escopados pelo tutor logado
// (GET /api/pets/by-tutor/{tutorId}).

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petsService } from '../services/petsService';

const petsDoTutorKey = (tutorId) => ['pets', tutorId];
const petKey = (id) => ['pet', id];

/** Lista todos os pets do tutor logado. */
export function usePets(tutorId) {
  return useQuery({
    queryKey: petsDoTutorKey(tutorId),
    queryFn: () => petsService.listarPorTutor(tutorId),
    enabled: !!tutorId,
  });
}

/** Busca um pet específico por id (tela de detalhe/edição). */
export function usePet(id) {
  return useQuery({
    queryKey: petKey(id),
    queryFn: () => petsService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados) => petsService.criar(dados),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: petsDoTutorKey(variables.tutorId) });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }) => petsService.atualizar(id, dados),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: petsDoTutorKey(variables.dados.tutorId) });
      queryClient.invalidateQueries({ queryKey: petKey(variables.id) });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => petsService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['vaccines'] });
    },
  });
}
