// src/hooks/useLembretes.js
// Lembretes unificados do tutor logado (vacinas atrasadas/a vencer + consultas
// pendentes). Usado por Início, Lembretes e pela sincronização de notificações —
// evita repetir a mesma lógica de cruzamento em várias telas.

import { useMemo } from 'react';
import { usePets } from './usePets';
import { useVaccinesVencidas, useVaccinesAVencer } from './useVaccines';
import { useAppointmentsPendentes } from './useAppointments';
import { montarLembretes } from '../utils/lembretes';

export function useLembretes() {
  const petsQ = usePets();
  const vencidasQ = useVaccinesVencidas();
  const aVencerQ = useVaccinesAVencer(30);
  const consultasQ = useAppointmentsPendentes();
  const queries = [petsQ, vencidasQ, aVencerQ, consultasQ];

  const lembretes = useMemo(
    () =>
      montarLembretes({
        pets: petsQ.data || [],
        vencidas: vencidasQ.data || [],
        aVencer: aVencerQ.data || [],
        consultas: consultasQ.data || [],
      }),
    [petsQ.data, vencidasQ.data, aVencerQ.data, consultasQ.data],
  );

  return {
    ...lembretes,
    pets: petsQ.data || [],
    carregando: queries.some((q) => q.isLoading),
    atualizando: queries.some((q) => q.isFetching),
    pronto: queries.every((q) => q.isSuccess),
    refetch: () => queries.forEach((q) => q.refetch()),
  };
}
