// src/screens/pets/PetForm.js
// Tela 6: Form de Pet — Create e Update do CRUD de Pets.
// Modo "criar" quando a rota não recebe petId; modo "editar" quando recebe.
// Campos alinhados 1:1 com PetRequest da API (name, species, breed,
// birthDate, weightKg, tutorId — este último injetado automaticamente a
// partir do usuário logado, nunca digitado pelo tutor).

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
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { usePet, useCreatePet, useUpdatePet } from '../../hooks/usePets';
import { useAuth } from '../../contexts/AuthContext';

const ESPECIES = [
  { value: 'DOG', label: 'Cachorro', icon: 'github' },
  { value: 'CAT', label: 'Gato', icon: 'wind' },
  { value: 'BIRD', label: 'Pássaro', icon: 'feather' },
  { value: 'RABBIT', label: 'Coelho', icon: 'circle' },
  { value: 'OTHER', label: 'Outro', icon: 'star' },
];

const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export default function PetForm({ navigation, route }) {
  const petId = route.params?.petId;
  const modoEdicao = !!petId;
  const { usuario } = useAuth();

  const { data: petExistente, isLoading: carregandoPet } = usePet(petId);
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();
  const salvando = createPet.isPending || updatePet.isPending;

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('DOG');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (petExistente) {
      setName(petExistente.name || '');
      setSpecies(petExistente.species || 'DOG');
      setBreed(petExistente.breed || '');
      setBirthDate(petExistente.birthDate || '');
      setWeightKg(petExistente.weightKg != null ? String(petExistente.weightKg) : '');
    }
  }, [petExistente]);

  const validar = () => {
    const e = {};
    if (!name.trim()) e.name = 'O nome do pet é obrigatório.';
    if (!birthDate.trim()) e.birthDate = 'A data de nascimento é obrigatória.';
    else if (!DATA_REGEX.test(birthDate)) e.birthDate = 'Use o formato AAAA-MM-DD.';
    if (weightKg && Number.isNaN(Number(weightKg.replace(',', '.')))) {
      e.weightKg = 'Peso inválido.';
    } else if (weightKg && Number(weightKg.replace(',', '.')) <= 0) {
      e.weightKg = 'Peso deve ser maior que zero.';
    }
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSalvar = () => {
    if (!validar()) return;
    if (!usuario?.tutorId) {
      Alert.alert('Sessão inválida', 'Não foi possível identificar o tutor logado. Faça login novamente.');
      return;
    }

    const dados = {
      name: name.trim(),
      species,
      breed: breed.trim() || null,
      birthDate,
      weightKg: weightKg ? Number(weightKg.replace(',', '.')) : null,
      tutorId: usuario.tutorId,
    };

    const onError = (error) => {
      const apiMsg = error?.response?.data?.message;
      Alert.alert('Erro', apiMsg || 'Não foi possível salvar o pet. Verifique os dados e tente novamente.');
    };

    if (modoEdicao) {
      updatePet.mutate(
        { id: petId, dados },
        { onSuccess: () => navigation.goBack(), onError },
      );
    } else {
      createPet.mutate(dados, {
        onSuccess: () => navigation.goBack(),
        onError,
      });
    }
  };

  if (modoEdicao && carregandoPet) return <LoadingOverlay mensagem="Carregando dados do pet..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <Header title={modoEdicao ? 'Editar Pet' : 'Novo Pet'} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <CustomInput
            label="Nome do pet *"
            icon="tag"
            placeholder="Rex, Mimi, Bidu..."
            value={name}
            onChangeText={(t) => { setName(t); setErros((e) => ({ ...e, name: null })); }}
            autoCapitalize="words"
            error={erros.name}
          />

          <Text style={styles.label}>Espécie *</Text>
          <View style={styles.especieRow}>
            {ESPECIES.map((opcao) => {
              const ativo = species === opcao.value;
              return (
                <TouchableOpacity
                  key={opcao.value}
                  style={[styles.especieChip, ativo && styles.especieChipAtivo]}
                  onPress={() => setSpecies(opcao.value)}
                >
                  <Feather name={opcao.icon} size={14} color={ativo ? COLORS.white : COLORS.textSecondary} />
                  <Text style={[styles.especieChipText, ativo && styles.especieChipTextAtivo]}>
                    {opcao.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <CustomInput
            label="Raça"
            icon="info"
            placeholder="Ex.: SRD, Labrador, Siamês..."
            value={breed}
            onChangeText={setBreed}
          />

          <CustomInput
            label="Data de nascimento (AAAA-MM-DD) *"
            icon="calendar"
            placeholder="2022-05-14"
            value={birthDate}
            onChangeText={(t) => { setBirthDate(t); setErros((e) => ({ ...e, birthDate: null })); }}
            keyboardType="numbers-and-punctuation"
            error={erros.birthDate}
          />

          <CustomInput
            label="Peso (kg)"
            icon="activity"
            placeholder="Ex.: 8.5"
            value={weightKg}
            onChangeText={(t) => { setWeightKg(t); setErros((e) => ({ ...e, weightKg: null })); }}
            keyboardType="decimal-pad"
            error={erros.weightKg}
          />

          <View style={styles.tutorInfo}>
            <Feather name="user" size={14} color={COLORS.textMuted} />
            <Text style={styles.tutorInfoText}>
              Tutor responsável: <Text style={{ fontWeight: '700' }}>{usuario?.nome}</Text>
            </Text>
          </View>

          <PrimaryButton
            label={modoEdicao ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PET'}
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
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  especieRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  especieChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  especieChipAtivo: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  especieChipText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
  },
  especieChipTextAtivo: { color: COLORS.white },
  tutorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  tutorInfoText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
});
