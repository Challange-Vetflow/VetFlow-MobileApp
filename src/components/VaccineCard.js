// src/components/VaccineCard.js
// Card de uma vacina registrada para um pet.
// Campos batem com VaccineResponse da API real (a própria API já calcula
// o campo booleano "expired", evitando lógica duplicada no app).

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { formatarData } from '../utils/dateUtils';
import { statusVacina } from '../utils/statusUtils';

export default function VaccineCard({ vacina, onPress, onDelete, showPetName = false }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const status = statusVacina(vacina);
  const statusColor = status ? COLORS[status.tone] : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85} disabled={!onPress}>
      <View style={[styles.bar, { backgroundColor: COLORS.vacina }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.iconWrapper}>
            <Feather name="shield" size={16} color={COLORS.vacina} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.titulo} numberOfLines={1}>{vacina.vaccineName}</Text>
            {showPetName && vacina.petName ? (
              <Text style={styles.tipoLabel}>{vacina.petName}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.infoRow}>
          <Feather name="calendar" size={12} color={COLORS.textMuted} />
          <Text style={styles.infoText}>Aplicada em {formatarData(vacina.appliedAt)}</Text>
        </View>

        {!!vacina.batch && (
          <View style={styles.infoRow}>
            <Feather name="hash" size={12} color={COLORS.textMuted} />
            <Text style={styles.infoText}>Lote {vacina.batch}</Text>
          </View>
        )}

        {status && (
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              Próxima dose em {formatarData(vacina.nextDoseAt)} · {status.label}
            </Text>
          </View>
        )}
      </View>

      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} hitSlop={8}>
          <Feather name="trash-2" size={16} color={COLORS.critical} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  bar: { width: 4 },
  content: { flex: 1, padding: SPACING.md },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.vacina + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  tipoLabel: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    marginTop: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  deleteBtn: {
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
