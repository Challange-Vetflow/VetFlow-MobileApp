// src/screens/Lembretes.js
// Tela 9: Lembretes — todas as vacinas atrasadas ou próximas do vencimento,
// entre os pets do tutor logado.
//
// Combina dois hooks que consomem endpoints prontos da API
// (/api/vaccines/expired e /api/vaccines/due-soon) com a lista de pets do
// tutor (usePets), já que aqueles endpoints retornam dados de TODOS os pets
// do sistema — o cruzamento com os pets do tutor é feito aqui no cliente.

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/Header';
import VaccineCard, { statusVacina } from '../components/VaccineCard';
import EmptyState from '../components/EmptyState';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { usePets } from '../hooks/usePets';
import { useVaccinesVencidas, useVaccinesAVencer } from '../hooks/useVaccines';

const FILTROS = [
  { key: 'TODAS', label: 'Todas' },
  { key: 'ATRASADAS', label: 'Atrasadas' },
  { key: 'PROXIMAS', label: 'Próximas' },
];

export default function Lembretes({ navigation }) {
  const { usuario } = useAuth();
  const [filtro, setFiltro] = useState('TODAS');

  const petsQuery = usePets(usuario?.tutorId);
  const vencidasQuery = useVaccinesVencidas();
  const aVencerQuery = useVaccinesAVencer(30);

  const petsPorId = useMemo(
    () => new Map((petsQuery.data || []).map((p) => [p.id, p])),
    [petsQuery.data],
  );

  const lembretes = useMemo(() => {
    const todas = [...(vencidasQuery.data || []), ...(aVencerQuery.data || [])];
    const vistos = new Set();
    return todas
      .filter((v) => petsPorId.has(v.petId) && !vistos.has(v.id) && vistos.add(v.id))
      .map((v) => ({ ...v, petName: petsPorId.get(v.petId)?.name, _status: statusVacina(v) }))
      .sort((a, b) => new Date(a.nextDoseAt) - new Date(b.nextDoseAt));
  }, [vencidasQuery.data, aVencerQuery.data, petsPorId]);

  const lembretesFiltrados = useMemo(() => {
    if (filtro === 'ATRASADAS') return lembretes.filter((v) => v._status?.label === 'Atrasada');
    if (filtro === 'PROXIMAS') return lembretes.filter((v) => v._status?.label !== 'Atrasada');
    return lembretes;
  }, [lembretes, filtro]);

  const carregando = petsQuery.isLoading || vencidasQuery.isLoading || aVencerQuery.isLoading;
  const atualizando = petsQuery.isFetching || vencidasQuery.isFetching || aVencerQuery.isFetching;

  const onRefresh = () => {
    petsQuery.refetch();
    vencidasQuery.refetch();
    aVencerQuery.refetch();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="Lembretes" />

      <View style={styles.filtrosRow}>
        {FILTROS.map((f) => {
          const ativo = filtro === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filtroChip, ativo && styles.filtroChipAtivo]}
              onPress={() => setFiltro(f.key)}
            >
              <Text style={[styles.filtroText, ativo && styles.filtroTextAtivo]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={carregando ? [] : lembretesFiltrados}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={atualizando && !carregando} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        renderItem={({ item }) => (
          <VaccineCard
            vacina={item}
            showPetName
            onPress={() => navigation.navigate('VaccineForm', { petId: item.petId, vaccineId: item.id })}
          />
        )}
        ListEmptyComponent={
          carregando ? (
            <Text style={styles.loadingText}>Carregando lembretes...</Text>
          ) : (
            <EmptyState icon="check-circle" title="Nenhum lembrete por aqui. Tudo em dia! 🎉" />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  filtrosRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  filtroChip: {
    paddingHorizontal: SPACING.lg,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtroChipAtivo: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filtroText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  filtroTextAtivo: { color: COLORS.white },
  listContent: { padding: SPACING.lg, flexGrow: 1 },
  loadingText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, textAlign: 'center', marginTop: 40 },
});
