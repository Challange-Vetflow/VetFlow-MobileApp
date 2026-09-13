// src/screens/vaccines/VaccineForm.js
// Tela 8: Form de Vacina — Create e Update do CRUD de Vacinas.
// Sempre vinculada a um pet (petId vem por parâmetro de rota).

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { usePet } from '../../hooks/usePets';
import { useVaccine, useCreateVaccine, useUpdateVaccine } from '../../hooks/useVaccines';

const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export default function VaccineForm({ navigation, route }) {
  const { petId, vaccineId } = route.params;
  const modoEdicao = !!vaccineId;

  const { data: pet } = usePet(petId);
  const { data: vacinaExistente, isLoading: carregandoVacina } = useVaccine(vaccineId);
  const createVaccine = useCreateVaccine();
  const updateVaccine = useUpdateVaccine();
  const salvando = createVaccine.isPending || updateVaccine.isPending;

  const [vaccineName, setVaccineName] = useState('');
  const [appliedAt, setAppliedAt] = useState('');
  const [nextDoseAt, setNextDoseAt] = useState('');
  const [batch, setBatch] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (vacinaExistente) {
      setVaccineName(vacinaExistente.vaccineName || '');
      setAppliedAt(vacinaExistente.appliedAt || '');
      setNextDoseAt(vacinaExistente.nextDoseAt || '');
      setBatch(vacinaExistente.batch || '');
    }
  }, [vacinaExistente]);

  const validar = () => {
    const e = {};
    if (!vaccineName.trim()) e.vaccineName = 'O nome da vacina é obrigatório.';
    if (!appliedAt.trim()) e.appliedAt = 'A data de aplicação é obrigatória.';
    else if (!DATA_REGEX.test(appliedAt)) e.appliedAt = 'Use o formato AAAA-MM-DD.';
    if (!nextDoseAt.trim()) e.nextDoseAt = 'A data da próxima dose é obrigatória.';
    else if (!DATA_REGEX.test(nextDoseAt)) e.nextDoseAt = 'Use o formato AAAA-MM-DD.';
    else if (DATA_REGEX.test(appliedAt) && nextDoseAt <= appliedAt) {
      e.nextDoseAt = 'A próxima dose deve ser posterior à data de aplicação.';
    }
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSalvar = () => {
    if (!validar()) return;

    const dados = {
      petId,
      vaccineName: vaccineName.trim(),
      appliedAt,
      nextDoseAt,
      batch: batch.trim() || null,
    };

    const onError = (error) => {
      const apiMsg = error?.response?.data?.message;
      Alert.alert('Erro', apiMsg || 'Não foi possível salvar a vacina. Verifique os dados e tente novamente.');
    };

    if (modoEdicao) {
      updateVaccine.mutate(
        { id: vaccineId, dados },
        { onSuccess: () => navigation.goBack(), onError },
      );
    } else {
      createVaccine.mutate(dados, { onSuccess: () => navigation.goBack(), onError });
    }
  };

  if (modoEdicao && carregandoVacina) return <LoadingOverlay mensagem="Carregando vacina..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title={modoEdicao ? 'Editar Vacina' : 'Nova Vacina'}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {pet && (
            <View style={styles.petBadge}>
              <Feather name="heart" size={14} color={COLORS.primary} />
              <Text style={styles.petBadgeText}>Para: {pet.name}</Text>
            </View>
          )}

          <CustomInput
            label="Nome da vacina *"
            icon="shield"
            placeholder="Ex.: V10, Antirrábica..."
            value={vaccineName}
            onChangeText={(t) => { setVaccineName(t); setErros((e) => ({ ...e, vaccineName: null })); }}
            autoCapitalize="words"
            error={erros.vaccineName}
          />

          <CustomInput
            label="Data de aplicação (AAAA-MM-DD) *"
            icon="calendar"
            placeholder="2026-08-10"
            value={appliedAt}
            onChangeText={(t) => { setAppliedAt(t); setErros((e) => ({ ...e, appliedAt: null })); }}
            keyboardType="numbers-and-punctuation"
            error={erros.appliedAt}
          />

          <CustomInput
            label="Próxima dose (AAAA-MM-DD) *"
            icon="bell"
            placeholder="2027-08-10"
            value={nextDoseAt}
            onChangeText={(t) => { setNextDoseAt(t); setErros((e) => ({ ...e, nextDoseAt: null })); }}
            keyboardType="numbers-and-punctuation"
            error={erros.nextDoseAt}
          />

          <CustomInput
            label="Lote"
            icon="hash"
            placeholder="Ex.: L2026-08A"
            value={batch}
            onChangeText={setBatch}
          />

          <PrimaryButton
            label={modoEdicao ? 'SALVAR ALTERAÇÕES' : 'REGISTRAR VACINA'}
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

const styles = StyleSheet.create({
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
});
