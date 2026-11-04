// src/components/StatCard.js
// Card compacto de estatística, usado na tela Início (dashboard).

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';

export default function StatCard({ icon, label, value, color }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const tint = color || COLORS.primary;
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrapper, { backgroundColor: tint + '22' }]}>
        <Feather name={icon} size={20} color={tint} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'flex-start',
    ...SHADOW.card,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
  },
});
