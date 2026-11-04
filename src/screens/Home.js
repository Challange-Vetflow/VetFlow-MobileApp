// src/screens/Home.js
// Tela Início (Dashboard) — visão consolidada dos pets e lembretes do tutor.
// Os dados vêm do hook useLembretes (TanStack Query + cruzamento com os pets
// do tutor); a tela não faz nenhuma chamada HTTP nem regra de negócio.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../components/Header';
import StatCard from '../components/StatCard';
import VaccineCard from '../components/VaccineCard';
import AppointmentCard from '../components/AppointmentCard';
import EmptyState from '../components/EmptyState';
import { FONTS, SPACING, RADIUS } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { useAuth } from '../contexts/AuthContext';
import { useLembretes } from '../hooks/useLembretes';
import { usePermissoes } from '../hooks/usePermissoes';

export default function Home({ navigation }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { podeGerenciarVacinas, podeCadastrarPet } = usePermissoes();
  const { usuario } = useAuth();
  const { pets, todos, consultas, atrasadas, carregando, atualizando, refetch } = useLembretes();

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
      <Header title="VetFlow" />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={atualizando && !carregando} onRefresh={refetch} tintColor={COLORS.primary} />
        }
      >
        <Text style={styles.saudacao}>
          Olá, {usuario?.nome ? usuario.nome.split(' ')[0] : 'tutor'} 👋
        </Text>
        <Text style={styles.subtitulo}>Veja como estão seus pets hoje.</Text>

        <View style={styles.statsRow}>
          <StatCard icon="heart" label="Pets" value={carregando ? '—' : pets.length} color={COLORS.primary} />
          <StatCard
            icon="alert-circle"
            label="Vacinas atrasadas"
            value={carregando ? '—' : atrasadas}
            color={atrasadas > 0 ? COLORS.critical : COLORS.success}
          />
          <StatCard icon="calendar" label="Consultas agendadas" value={carregando ? '—' : consultas.length} color={COLORS.consulta} />
        </View>

        <View style={styles.quickActions}>
          {podeCadastrarPet && (
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('PetForm')}>
              <Feather name="plus-circle" size={20} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Novo pet</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Lembretes')}>
            <Feather name="bell" size={20} color={COLORS.secondary} />
            <Text style={styles.quickActionText}>Ver lembretes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos lembretes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Lembretes')}>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {carregando ? (
          <Text style={styles.loadingText}>Carregando lembretes...</Text>
        ) : todos.length === 0 ? (
          <EmptyState icon="check-circle" title="Nenhum lembrete pendente. Tudo em dia por aqui! 🎉" />
        ) : (
          todos.slice(0, 3).map((item) =>
            item.kind === 'vacina' ? (
              <VaccineCard key={item.key} vacina={item} showPetName onPress={() => abrirItem(item)} />
            ) : (
              <AppointmentCard key={item.key} consulta={item} clinicName={item.clinicName} showPetName onPress={() => abrirItem(item)} />
            ),
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  saudacao: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  subtitulo: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, marginTop: 2, marginBottom: SPACING.lg },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
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
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  sectionLink: { color: COLORS.primary, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  loadingText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
});
