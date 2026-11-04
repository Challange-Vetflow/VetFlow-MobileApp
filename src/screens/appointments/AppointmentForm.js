// src/screens/appointments/AppointmentForm.js
// Form de Consulta — Create e Update do CRUD de Consultas (Appointment).
// Sempre vinculada a um pet (petId por parâmetro de rota). Com `appointmentId`
// entra em modo edição.

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import Header from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import LoadingOverlay from '../../components/LoadingOverlay';
import { FONTS, SPACING, RADIUS } from '../../constants/theme';
import { LISTA_TIPOS_CONSULTA } from '../../constants/appointmentTypes';
import { useTheme } from '../../contexts/ThemeContext';
import useThemedStyles from '../../hooks/useThemedStyles';
import { usePet } from '../../hooks/usePets';
import { useClinics } from '../../hooks/useClinics';
import {
  useAppointment,
  useCreateAppointment,
  useUpdateAppointment,
} from '../../hooks/useAppointments';
import { validarConsulta } from '../../utils/validators';
import { camposDoErro, mensagemDeErro } from '../../utils/apiError';

export default function AppointmentForm({ navigation, route }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { petId, appointmentId } = route.params;
  const modoEdicao = !!appointmentId;

  const { data: pet } = usePet(petId);
  const { data: clinicas = [], isLoading: carregandoClinicas } = useClinics();
  const { data: consultaExistente, isLoading: carregandoConsulta } = useAppointment(appointmentId);
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const salvando = createAppointment.isPending || updateAppointment.isPending;

  const [type, setType] = useState('CHECKUP');
  const [clinicId, setClinicId] = useState(null);
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [notes, setNotes] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (consultaExistente) {
      setType(consultaExistente.type || 'CHECKUP');
      setClinicId(consultaExistente.clinicId ?? null);
      const [d, h] = (consultaExistente.scheduledAt || '').split('T');
      setData(d || '');
      setHora((h || '').slice(0, 5));
      setNotes(consultaExistente.notes || '');
    }
  }, [consultaExistente]);

  const limpar = (campo) => setErros((e) => ({ ...e, [campo]: null }));

  const handleSalvar = () => {
    const e = validarConsulta({ clinicId, data, hora });
    setErros(e);
    if (Object.keys(e).length > 0) return;

    const dados = {
      petId,
      clinicId,
      scheduledAt: `${data}T${hora}:00`,
      type,
      notes: notes.trim() || null,
    };

    const onError = (error) => {
      setErros((atual) => ({ ...atual, ...camposDoErro(error) }));
      Alert.alert('Erro', mensagemDeErro(error, 'Não foi possível salvar a consulta. Verifique os dados e tente novamente.'));
    };

    if (modoEdicao) {
      updateAppointment.mutate({ id: appointmentId, dados }, { onSuccess: () => navigation.goBack(), onError });
    } else {
      createAppointment.mutate(dados, { onSuccess: () => navigation.goBack(), onError });
    }
  };

  if (modoEdicao && carregandoConsulta) return <LoadingOverlay mensagem="Carregando consulta..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <Header title={modoEdicao ? 'Editar Consulta' : 'Nova Consulta'} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {pet && (
            <View style={styles.petBadge}>
              <Feather name="heart" size={14} color={COLORS.primary} />
              <Text style={styles.petBadgeText}>Para: {pet.name}</Text>
            </View>
          )}

          <Text style={styles.label}>Tipo de consulta *</Text>
          <View style={styles.chipsRow}>
            {LISTA_TIPOS_CONSULTA.map((opcao) => {
              const ativo = type === opcao.value;
              return (
                <TouchableOpacity
                  key={opcao.value}
                  style={[styles.chip, ativo && styles.chipAtivo]}
                  onPress={() => setType(opcao.value)}
                >
                  <Feather name={opcao.icon} size={14} color={ativo ? COLORS.onPrimary : COLORS.textSecondary} />
                  <Text style={[styles.chipText, ativo && styles.chipTextAtivo]}>{opcao.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Clínica *</Text>
          {carregandoClinicas ? (
            <Text style={styles.helper}>Carregando clínicas...</Text>
          ) : clinicas.length === 0 ? (
            <Text style={styles.helper}>Nenhuma clínica disponível no momento.</Text>
          ) : (
            <View style={styles.clinicList}>
              {clinicas.map((c) => {
                const ativa = clinicId === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.clinicItem, ativa && styles.clinicItemAtivo]}
                    onPress={() => { setClinicId(c.id); limpar('clinicId'); }}
                  >
                    <Feather
                      name={ativa ? 'check-circle' : 'circle'}
                      size={18}
                      color={ativa ? COLORS.primary : COLORS.textMuted}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.clinicName}>{c.name}</Text>
                      {!!c.address && <Text style={styles.clinicAddress} numberOfLines={1}>{c.address}</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {!!erros.clinicId && <Text style={styles.errorText}>{erros.clinicId}</Text>}

          <View style={styles.row}>
            <View style={{ flex: 3 }}>
              <CustomInput
                label="Data (AAAA-MM-DD) *"
                icon="calendar"
                placeholder="2026-11-20"
                value={data}
                onChangeText={(t) => { setData(t); limpar('data'); }}
                keyboardType="numbers-and-punctuation"
                error={erros.data}
              />
            </View>
            <View style={{ flex: 2 }}>
              <CustomInput
                label="Hora (HH:MM) *"
                icon="clock"
                placeholder="14:30"
                value={hora}
                onChangeText={(t) => { setHora(t); limpar('hora'); }}
                keyboardType="numbers-and-punctuation"
                error={erros.hora}
              />
            </View>
          </View>

          <CustomInput
            label="Observações"
            icon="edit-3"
            placeholder="Motivo, sintomas, jejum..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            style={{ height: 90 }}
          />

          <PrimaryButton
            label={modoEdicao ? 'SALVAR ALTERAÇÕES' : 'AGENDAR CONSULTA'}
            icon="save"
            onPress={handleSalvar}
            loading={salvando}
            style={{ marginTop: SPACING.sm }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxl },
  petBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    marginBottom: SPACING.lg,
  },
  petBadgeText: { color: COLORS.primary, fontSize: FONTS.sizes.sm, fontWeight: '700' },
  label: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, fontWeight: '600', marginBottom: SPACING.sm },
  helper: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginBottom: SPACING.lg },
  errorText: { color: COLORS.critical, fontSize: FONTS.sizes.xs, marginTop: -SPACING.sm, marginBottom: SPACING.lg },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipAtivo: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, fontWeight: '700' },
  chipTextAtivo: { color: COLORS.onPrimary },
  clinicList: { gap: SPACING.sm, marginBottom: SPACING.lg },
  clinicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  clinicItemAtivo: { borderColor: COLORS.primary, backgroundColor: COLORS.surfaceAlt },
  clinicName: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '700' },
  clinicAddress: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 1 },
  row: { flexDirection: 'row', gap: SPACING.md },
});
