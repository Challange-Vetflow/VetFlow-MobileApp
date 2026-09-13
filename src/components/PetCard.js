// src/components/PetCard.js
// Card de pet exibido na tela "Meus Pets".
// Campos batem com PetResponse da API real (species em inglês, ageInMonths
// já calculado pelo backend).

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

// NOTA: o pacote Feather não possui ícones literais de "cachorro/gato/pássaro";
// usamos ícones aproximados do conjunto disponível. Podem ser trocados por
// uma lib de ícones específica de pets, se o grupo preferir.
const ESPECIE_CONFIG = {
  DOG: { icon: 'github', label: 'Cachorro' },
  CAT: { icon: 'wind', label: 'Gato' },
  BIRD: { icon: 'feather', label: 'Pássaro' },
  RABBIT: { icon: 'circle', label: 'Coelho' },
  OTHER: { icon: 'star', label: 'Outro' },
};

export function formatarIdade(ageInMonths) {
  if (ageInMonths == null) return null;
  if (ageInMonths < 12) return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
  const anos = Math.floor(ageInMonths / 12);
  const mesesRestantes = ageInMonths % 12;
  const base = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  return mesesRestantes > 0 ? `${base} e ${mesesRestantes}m` : base;
}

export default function PetCard({ pet, onPress }) {
  const config = ESPECIE_CONFIG[pet.species] || ESPECIE_CONFIG.OTHER;
  const idade = formatarIdade(pet.ageInMonths);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconWrapper}>
        <Feather name={config.icon} size={24} color={COLORS.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.nome} numberOfLines={1}>{pet.name}</Text>
        <Text style={styles.detalhe} numberOfLines={1}>
          {config.label}{pet.breed ? ` · ${pet.breed}` : ''}
        </Text>
        <View style={styles.metaRow}>
          {idade && (
            <View style={styles.metaItem}>
              <Feather name="calendar" size={12} color={COLORS.textMuted} />
              <Text style={styles.metaText}>{idade}</Text>
            </View>
          )}
          {!!pet.weightKg && (
            <View style={styles.metaItem}>
              <Feather name="activity" size={12} color={COLORS.textMuted} />
              <Text style={styles.metaText}>{pet.weightKg} kg</Text>
            </View>
          )}
        </View>
      </View>

      <Feather name="chevron-right" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.md,
    ...SHADOW.card,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  nome: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  detalhe: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
  },
});
