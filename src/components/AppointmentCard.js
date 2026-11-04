// src/components/AppointmentCard.js
// Card de uma consulta agendada (AppointmentResponse da API).

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import { TIPOS_CONSULTA } from '../constants/appointmentTypes';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { formatarDataHora } from '../utils/dateUtils';
import { statusConsulta } from '../utils/statusUtils';

export default function AppointmentCard({
  consulta,
  clinicName,
  showPetName = false,
  onPress,
  onComplete,
  onDelete,
}) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const tipo = TIPOS_CONSULTA[consulta.type] || TIPOS_CONSULTA.OTHER;
  const status = statusConsulta(consulta);
  const statusColor = status ? COLORS[status.tone] : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85} disabled={!onPress}>
      <View style={[styles.bar, { backgroundColor: COLORS.consulta }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.iconWrapper}>
            <Feather name={tipo.icon} size={16} color={COLORS.consulta} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.titulo} numberOfLines={1}>{tipo.label}</Text>
            {showPetName && consulta.petName ? (
              <Text style={styles.tipoLabel}>{consulta.petName}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.infoRow}>
          <Feather name="clock" size={12} color={COLORS.textMuted} />
          <Text style={styles.infoText}>{formatarDataHora(consulta.scheduledAt)}</Text>
        </View>

        {!!clinicName && (
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={12} color={COLORS.textMuted} />
            <Text style={styles.infoText} numberOfLines={1}>{clinicName}</Text>
          </View>
        )}

        {!!consulta.notes && (
          <View style={styles.infoRow}>
            <Feather name="file-text" size={12} color={COLORS.textMuted} />
            <Text style={styles.infoText} numberOfLines={2}>{consulta.notes}</Text>
          </View>
        )}

        {status && (
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{status.label}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {onComplete && !consulta.completed && (
          <TouchableOpacity onPress={onComplete} hitSlop={8} style={styles.actionBtn}>
            <Feather name="check-circle" size={18} color={COLORS.success} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} hitSlop={8} style={styles.actionBtn}>
            <Feather name="trash-2" size={16} color={COLORS.critical} />
          </TouchableOpacity>
        )}
      </View>
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
  topRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.consulta + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '700' },
  tipoLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  infoText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, flexShrink: 1 },
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
  actions: { justifyContent: 'center' },
  actionBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, alignItems: 'center' },
});
