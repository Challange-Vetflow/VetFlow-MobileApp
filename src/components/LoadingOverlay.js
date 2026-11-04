// src/components/LoadingOverlay.js
// Feedback visual de carregamento — usado enquanto o TanStack Query busca
// dados na API (isLoading) e enquanto a sessão é restaurada no boot do app.

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { FONTS } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';

export default function LoadingOverlay({ mensagem = 'Carregando...' }) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>{mensagem}</Text>
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    gap: 16,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
  },
});
