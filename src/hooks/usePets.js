// src/hooks/usePets.js
// Hooks do TanStack Query para o CRUD de Pets, conforme o perfil do usuário logado.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petsService } from '../services/petsService';
import { reminderService } from '../services/reminderService';
import { useAuth } from '../contexts/AuthContext';

const PETS_KEY = ['pets'];
const petKey = (id) => ['pet', id];

/**
 * Pets que o usuário logado pode ver, conforme o perfil:
 *  - TUTOR → GET /pets/by-tutor/{tutorId}
 *  - VET   → GET /pets (todos, paginado — até 100)
 */
export function usePets() {
  const { usuario } = useAuth();
  const isVet = usuario?.role === 'VET';
  const tutorId = usuario?.tutorId;

  return useQuery({
    queryKey: isVet ? [...PETS_KEY, 'todos'] : [...PETS_KEY, 'tutor', tutorId],
    queryFn: () => (isVet ? petsService.listarTodos() : petsService.listarPorTutor(tutorId)),
    enabled: isVet || !!tutorId,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS_KEY });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }) => petsService.atualizar(id, dados),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: PETS_KEY });
      queryClient.invalidateQueries({ queryKey: petKey(variables.id) });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => petsService.deletar(id),
    onSuccess: (_data, petId) => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['vaccines'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      reminderService.aoRemoverPet(petId); // cancela lembretes agendados do pet removido
    },
  });
}
