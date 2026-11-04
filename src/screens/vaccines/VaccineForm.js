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
import EmptyState from '../../components/EmptyState';
import { FONTS, SPACING, RADIUS } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import useThemedStyles from '../../hooks/useThemedStyles';
import { usePet } from '../../hooks/usePets';
import { useVaccine, useCreateVaccine, useUpdateVaccine } from '../../hooks/useVaccines';
import { validarVacina } from '../../utils/validators';
import { camposDoErro, mensagemDeErro } from '../../utils/apiError';
import { usePermissoes } from '../../hooks/usePermissoes';

export default function VaccineForm({ navigation, route }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { petId, vaccineId } = route.params;
  const { podeGerenciarVacinas } = usePermissoes();
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
    const e = validarVacina({ vaccineName, appliedAt, nextDoseAt });
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
      setErros((atual) => ({ ...atual, ...camposDoErro(error) }));
      Alert.alert('Erro', mensagemDeErro(error, 'Não foi possível salvar a vacina. Verifique os dados e tente novamente.'));
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

  if (!podeGerenciarVacinas) {
    // Regra da API: só a clínica (VET) registra/edita vacinas. Tutor apenas consulta.
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Vacina" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="lock"
          title="As vacinas são registradas pela clínica veterinária. Você pode acompanhar o histórico e os lembretes no detalhe do pet."
          actionLabel="Voltar"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

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
});
