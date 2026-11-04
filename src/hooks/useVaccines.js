// src/hooks/useVaccines.js
// Hooks do TanStack Query para o CRUD de Vacinas, vinculadas a um pet.
// Também expõe os hooks de "lembretes" que consomem diretamente os
// endpoints /api/vaccines/expired e /api/vaccines/due-soon da API.
//
// As mutações também acionam o reminderService (notificações locais):
// criar/editar agenda os lembretes da próxima dose; remover cancela.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vaccinesService } from '../services/vaccinesService';
import { reminderService } from '../services/reminderService';

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

// A API já devolve `petName` na resposta; o cache do pet é só reserva.
function nomeDoPet(queryClient, registro) {
  return registro?.petName || queryClient.getQueryData(['pet', registro?.petId])?.name || 'seu pet';
}

export function useCreateVaccine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados) => vaccinesService.criar(dados),
    onSuccess: (vacina) => {
      queryClient.invalidateQueries({ queryKey: ['vaccines'] });
      reminderService.aoSalvarVacina(vacina, nomeDoPet(queryClient, vacina));
    },
  });
}

export function useUpdateVaccine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }) => vaccinesService.atualizar(id, dados),
    onSuccess: (vacina) => {
      queryClient.invalidateQueries({ queryKey: ['vaccines'] });
      queryClient.invalidateQueries({ queryKey: ['vaccine', vacina.id] });
      reminderService.aoSalvarVacina(vacina, nomeDoPet(queryClient, vacina));
    },
  });
}

export function useDeleteVaccine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => vaccinesService.deletar(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vaccines'] });
      reminderService.aoRemoverVacina(variables.id);
    },
  });
}
