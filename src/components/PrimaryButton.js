// src/components/PrimaryButton.js
// Botão de ação principal, com estado de carregamento embutido.

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS, RADIUS } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import useThemedStyles from '../hooks/useThemedStyles';

export default function PrimaryButton({
  label,
  icon,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  style,
}) {
  const { colors: COLORS } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.onPrimary} />
      ) : (
        <>
          {icon && (
            <Feather
              name={icon}
              size={18}
              color={variant === 'outline' ? COLORS.primary : COLORS.onPrimary}
            />
          )}
          <Text style={[styles.label, variant === 'outline' && styles.labelOutline]}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  base: {
    height: 52,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.secondary },
  danger: { backgroundColor: COLORS.critical },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  disabled: { opacity: 0.6 },
  label: {
    color: COLORS.onPrimary,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  labelOutline: {
    color: COLORS.primary,
  },
});
