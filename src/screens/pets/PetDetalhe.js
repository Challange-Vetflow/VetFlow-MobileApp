// src/screens/pets/PetDetalhe.js
// Tela: Detalhe do Pet — dados do pet + histórico de vacinas e consultas,
// com atalhos para editar/remover o pet e criar/editar/remover vacinas e consultas.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import VaccineCard from '../../components/VaccineCard';
import AppointmentCard from '../../components/AppointmentCard';
import EmptyState from '../../components/EmptyState';
import LoadingOverlay from '../../components/LoadingOverlay';
import { FONTS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import useThemedStyles from '../../hooks/useThemedStyles';
import { usePet, useDeletePet } from '../../hooks/usePets';
import { useVaccinesByPet, useDeleteVaccine } from '../../hooks/useVaccines';
import { useAppointmentsByPet, useDeleteAppointment, useCompleteAppointment } from '../../hooks/useAppointments';
import { useClinics } from '../../hooks/useClinics';
import { formatarIdade } from '../../utils/dateUtils';
import { mensagemDeErro } from '../../utils/apiError';
import { usePermissoes } from '../../hooks/usePermissoes';

const ESPECIE_LABEL = { DOG: 'Cachorro', CAT: 'Gato', BIRD: 'Pássaro', RABBIT: 'Coelho', OTHER: 'Outro' };

export default function PetDetalhe({ navigation, route }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { petId } = route.params;
  const { podeGerenciarVacinas, podeConcluirConsulta } = usePermissoes();

  const { data: pet, isLoading: carregandoPet, refetch: refetchPet } = usePet(petId);
  const { data: vacinas = [], isLoading: carregandoVacinas, isFetching, refetch: refetchVacinas } =
    useVaccinesByPet(petId);
  const { data: consultas = [], isLoading: carregandoConsultas, refetch: refetchConsultas } =
    useAppointmentsByPet(petId);
  const { data: clinicas = [] } = useClinics();
  const clinicaPorId = new Map(clinicas.map((c) => [c.id, c.name]));
  const deletePet = useDeletePet();
  const deleteVaccine = useDeleteVaccine();
  const deleteAppointment = useDeleteAppointment();
  const completeAppointment = useCompleteAppointment();

  const onRefresh = () => {
    refetchPet();
    refetchVacinas();
    refetchConsultas();
  };

  const handleDeletarPet = () => {
    Alert.alert(
      'Remover pet',
      `Deseja remover "${pet?.name}" e todo o seu histórico de vacinas e consultas? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () =>
            deletePet.mutate(petId, {
              onSuccess: () => navigation.goBack(),
              onError: (error) => Alert.alert('Erro', mensagemDeErro(error, 'Não foi possível remover o pet.')),
            }),
        },
      ],
    );
  };

  const handleDeletarVacina = (vacina) => {
    Alert.alert('Remover vacina', `Remover o registro de "${vacina.vaccineName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () =>
          deleteVaccine.mutate(
            { id: vacina.id, petId },
            { onError: (error) => Alert.alert('Erro', mensagemDeErro(error, 'Não foi possível remover a vacina.')) },
          ),
      },
    ]);
  };

  const handleDeletarConsulta = (consulta) => {
    Alert.alert('Cancelar consulta', 'Deseja cancelar esta consulta agendada?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar consulta',
        style: 'destructive',
        onPress: () =>
          deleteAppointment.mutate(
            { id: consulta.id },
            { onError: (error) => Alert.alert('Erro', mensagemDeErro(error, 'Não foi possível cancelar a consulta.')) },
          ),
      },
    ]);
  };

  const handleConcluirConsulta = (consulta) => {
    Alert.alert('Concluir consulta', 'Marcar esta consulta como realizada?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Concluir',
        onPress: () =>
          completeAppointment.mutate(
            { id: consulta.id },
            { onError: (error) => Alert.alert('Erro', mensagemDeErro(error, 'Não foi possível concluir a consulta.')) },
          ),
      },
    ]);
  };

  if (carregandoPet || !pet) return <LoadingOverlay mensagem="Carregando pet..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title={pet.name}
        onBack={() => navigation.goBack()}
        rightIcon="edit-2"
        onRightPress={() => navigation.navigate('PetForm', { petId })}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isFetching && !carregandoVacinas && !carregandoConsultas} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Card de resumo do pet */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Espécie</Text>
              <Text style={styles.summaryValue}>{ESPECIE_LABEL[pet.species] || pet.species}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Raça</Text>
              <Text style={styles.summaryValue}>{pet.breed || '—'}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Idade</Text>
              <Text style={styles.summaryValue}>{formatarIdade(pet.ageInMonths) || '—'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Peso</Text>
              <Text style={styles.summaryValue}>{pet.weightKg ? `${pet.weightKg} kg` : '—'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.deletePetBtn} onPress={handleDeletarPet}>
            <Feather name="trash-2" size={14} color={COLORS.critical} />
            <Text style={styles.deletePetText}>Remover pet</Text>
          </TouchableOpacity>
        </View>

        {/* Histórico de vacinas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Histórico de vacinas</Text>
          <Text style={styles.sectionCount}>{vacinas.length}</Text>
        </View>

        {carregandoVacinas ? (
          <Text style={styles.loadingText}>Carregando vacinas...</Text>
        ) : vacinas.length === 0 ? (
          <EmptyState
            icon="shield"
            title={podeGerenciarVacinas ? 'Nenhuma vacina registrada para este pet ainda.' : 'Nenhuma vacina registrada ainda. As vacinas são lançadas pela clínica veterinária.'}
          />
        ) : (
          vacinas.map((vacina) => (
            <VaccineCard
              key={vacina.id}
              vacina={vacina}
              onPress={podeGerenciarVacinas ? () => navigation.navigate('VaccineForm', { petId, vaccineId: vacina.id }) : undefined}
              onDelete={podeGerenciarVacinas ? () => handleDeletarVacina(vacina) : undefined}
            />
          ))
        )}
        {/* Consultas */}
        <View style={[styles.sectionHeader, { marginTop: SPACING.xl }]}>
          <Text style={styles.sectionTitle}>Consultas</Text>
          <Text style={styles.sectionCount}>{consultas.length}</Text>
        </View>

        {carregandoConsultas ? (
          <Text style={styles.loadingText}>Carregando consultas...</Text>
        ) : consultas.length === 0 ? (
          <EmptyState icon="calendar" title="Nenhuma consulta agendada para este pet ainda." />
        ) : (
          consultas.map((consulta) => (
            <AppointmentCard
              key={consulta.id}
              consulta={consulta}
              clinicName={consulta.clinicName || clinicaPorId.get(consulta.clinicId)}
              onPress={() => navigation.navigate('AppointmentForm', { petId, appointmentId: consulta.id })}
              onComplete={podeConcluirConsulta ? () => handleConcluirConsulta(consulta) : undefined}
              onDelete={() => handleDeletarConsulta(consulta)}
            />
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          {podeGerenciarVacinas && (
            <PrimaryButton
              label="VACINA"
              icon="plus"
              style={styles.footerBtn}
              onPress={() => navigation.navigate('VaccineForm', { petId })}
            />
          )}
          <PrimaryButton
            label="CONSULTA"
            icon="calendar"
            variant="secondary"
            style={styles.footerBtn}
            onPress={() => navigation.navigate('AppointmentForm', { petId })}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...SHADOW.card,
  },
  summaryRow: { flexDirection: 'row', marginBottom: SPACING.md },
  summaryItem: { flex: 1 },
  summaryLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginBottom: 2 },
  summaryValue: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '700' },
  deletePetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
  },
  deletePetText: { color: COLORS.critical, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  sectionCount: {
    backgroundColor: COLORS.surfaceAlt,
    color: COLORS.primary,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  loadingText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  footerRow: { flexDirection: 'row', gap: SPACING.md },
  footerBtn: { flex: 1 },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
});
