// src/screens/Home.js
// Tela 3: Início (Dashboard) — visão consolidada dos pets e lembretes do tutor.
//
// Os endpoints /api/vaccines/expired e /api/vaccines/due-soon da API são
// GLOBAIS (todos os pets do sistema, não só os do tutor logado). Por isso,
// aqui cruzamos essas vacinas com a lista de pets do próprio tutor
// (usePets) para exibir só o que é relevante para ele.

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../components/Header';
import StatCard from '../components/StatCard';
import VaccineCard, { statusVacina } from '../components/VaccineCard';
import EmptyState from '../components/EmptyState';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { usePets } from '../hooks/usePets';
import { useVaccinesVencidas, useVaccinesAVencer } from '../hooks/useVaccines';

export default function Home({ navigation }) {
  const { usuario } = useAuth();
  const petsQuery = usePets(usuario?.tutorId);
  const vencidasQuery = useVaccinesVencidas();
  const aVencerQuery = useVaccinesAVencer(30);

  const pets = petsQuery.data || [];
  const petsPorId = useMemo(() => new Map(pets.map((p) => [p.id, p])), [pets]);

  // Lembretes = vacinas (vencidas + a vencer) que pertencem a um pet DESTE tutor.
  const lembretesDoTutor = useMemo(() => {
    const todas = [...(vencidasQuery.data || []), ...(aVencerQuery.data || [])];
    const vistos = new Set();
    return todas
      .filter((v) => petsPorId.has(v.petId) && !vistos.has(v.id) && vistos.add(v.id))
      .map((v) => ({ ...v, petName: petsPorId.get(v.petId)?.name }))
      .sort((a, b) => new Date(a.nextDoseAt) - new Date(b.nextDoseAt));
  }, [vencidasQuery.data, aVencerQuery.data, petsPorId]);

  const atrasadas = useMemo(
    () => lembretesDoTutor.filter((v) => statusVacina(v)?.label === 'Atrasada').length,
    [lembretesDoTutor],
  );

  const carregando = petsQuery.isLoading || vencidasQuery.isLoading || aVencerQuery.isLoading;
  const atualizando = petsQuery.isFetching || vencidasQuery.isFetching || aVencerQuery.isFetching;

  const onRefresh = () => {
    petsQuery.refetch();
    vencidasQuery.refetch();
    aVencerQuery.refetch();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header title="VetFlow" />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={atualizando && !carregando} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        <Text style={styles.saudacao}>
          Olá, {usuario?.nome ? usuario.nome.split(' ')[0] : 'tutor'} 👋
        </Text>
        <Text style={styles.subtitulo}>Veja como estão seus pets hoje.</Text>

        {/* Estatísticas */}
        <View style={styles.statsRow}>
          <StatCard icon="heart" label="Pets cadastrados" value={carregando ? '—' : pets.length} color={COLORS.primary} />
          <StatCard
            icon="alert-circle"
            label="Vacinas atrasadas"
            value={carregando ? '—' : atrasadas}
            color={atrasadas > 0 ? COLORS.critical : COLORS.success}
          />
        </View>

        {/* Ações rápidas */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('PetForm')}>
            <Feather name="plus-circle" size={20} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Novo pet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Lembretes')}>
            <Feather name="bell" size={20} color={COLORS.secondary} />
            <Text style={styles.quickActionText}>Ver lembretes</Text>
          </TouchableOpacity>
        </View>

        {/* Próximos lembretes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas vacinas</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Lembretes')}>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {carregando ? (
          <Text style={styles.loadingText}>Carregando lembretes...</Text>
        ) : lembretesDoTutor.length === 0 ? (
          <EmptyState icon="check-circle" title="Nenhum lembrete pendente. Tudo em dia por aqui! 🎉" />
        ) : (
          lembretesDoTutor
            .slice(0, 3)
            .map((vacina) => <VaccineCard key={vacina.id} vacina={vacina} showPetName />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  saudacao: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  subtitulo: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, marginTop: 2, marginBottom: SPACING.lg },
  statsRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.lg },
  quickActions: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xl },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 48,
  },
  quickActionText: { color: COLORS.textPrimary, fontSize: FONTS.sizes.sm, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  sectionLink: { color: COLORS.primary, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  loadingText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
});
