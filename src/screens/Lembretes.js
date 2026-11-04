// src/screens/Lembretes.js
// Tela Lembretes — vacinas atrasadas/a vencer e consultas pendentes dos pets
// do tutor logado, com filtro. Dados via useLembretes (sem lógica na tela).

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/Header';
import VaccineCard from '../components/VaccineCard';
import AppointmentCard from '../components/AppointmentCard';
import EmptyState from '../components/EmptyState';
import { FONTS, SPACING, RADIUS } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { useLembretes } from '../hooks/useLembretes';
import { usePermissoes } from '../hooks/usePermissoes';

const FILTROS = [
  { key: 'TODAS', label: 'Todos' },
  { key: 'ATRASADAS', label: 'Atrasadas' },
  { key: 'PROXIMAS', label: 'Próximos' },
];

export default function Lembretes({ navigation }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { podeGerenciarVacinas } = usePermissoes();
  const [filtro, setFiltro] = useState('TODAS');
  const { todos, carregando, atualizando, refetch } = useLembretes();

  const filtrados = useMemo(() => {
    if (filtro === 'ATRASADAS') return todos.filter((i) => i.status?.tone === 'critical');
    if (filtro === 'PROXIMAS') return todos.filter((i) => i.status?.tone !== 'critical');
    return todos;
  }, [todos, filtro]);

  const abrirItem = (item) => {
    if (item.kind === 'vacina') {
      // Tutor só consulta vacinas (registro é da clínica): leva ao detalhe do pet.
      if (podeGerenciarVacinas) navigation.navigate('VaccineForm', { petId: item.petId, vaccineId: item.id });
      else navigation.navigate('PetDetalhe', { petId: item.petId });
    } else {
      navigation.navigate('AppointmentForm', { petId: item.petId, appointmentId: item.id });
    }
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
        data={carregando ? [] : filtrados}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={atualizando && !carregando} onRefresh={refetch} tintColor={COLORS.primary} />
        }
        renderItem={({ item }) =>
          item.kind === 'vacina' ? (
            <VaccineCard vacina={item} showPetName onPress={() => abrirItem(item)} />
          ) : (
            <AppointmentCard consulta={item} clinicName={item.clinicName} showPetName onPress={() => abrirItem(item)} />
          )
        }
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

const createStyles = (COLORS) => StyleSheet.create({
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
  filtroTextAtivo: { color: COLORS.onPrimary },
  listContent: { padding: SPACING.lg, flexGrow: 1 },
  loadingText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, textAlign: 'center', marginTop: 40 },
});
