// src/hooks/useAppointments.js
// Hooks do TanStack Query para o CRUD de Consultas (agendamentos).
// As mutações acionam o reminderService: agendar/editar cria lembretes
// (24h e 1h antes); concluir/remover cancela.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsService } from '../services/appointmentsService';
import { reminderService } from '../services/reminderService';

const doPetKey = (petId) => ['appointments', 'pet', petId];
const PENDENTES_KEY = ['appointments', 'pending'];

export function useAppointmentsByPet(petId) {
  return useQuery({
    queryKey: doPetKey(petId),
    queryFn: () => appointmentsService.listarPorPet(petId),
    enabled: !!petId,
  });
}

export function useAppointment(id) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsService.buscarPorId(id),
    enabled: !!id,
  });
}

/** Consultas futuras não concluídas — de TODOS os pets do sistema. */
export function useAppointmentsPendentes() {
  return useQuery({
    queryKey: PENDENTES_KEY,
    queryFn: () => appointmentsService.listarPendentes(),
  });
}

// A API já devolve `petName` na resposta; o cache do pet é só reserva.
function nomeDoPet(queryClient, registro) {
  return registro?.petName || queryClient.getQueryData(['pet', registro?.petId])?.name || 'seu pet';
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados) => appointmentsService.criar(dados),
    onSuccess: (consulta) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      reminderService.aoSalvarConsulta(consulta, nomeDoPet(queryClient, consulta));
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }) => appointmentsService.atualizar(id, dados),
    onSuccess: (consulta) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', consulta.id] });
      reminderService.aoSalvarConsulta(consulta, nomeDoPet(queryClient, consulta));
    },
  });
}

export function useCompleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => appointmentsService.concluir(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      reminderService.aoEncerrarConsulta(variables.id);
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => appointmentsService.deletar(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      reminderService.aoEncerrarConsulta(variables.id);
    },
  });
}
