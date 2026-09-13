// src/components/Header.js
// Cabeçalho padrão do VetFlow, reutilizado em várias telas.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function Header({ title, onBack, rightIcon, onRightPress }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {onBack ? (
          <TouchableOpacity style={styles.iconButton} onPress={onBack}>
            <Feather name="arrow-left" size={22} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        <View style={styles.titleWrapper}>
          <Feather name="heart" size={16} color={COLORS.white} />
          <Text style={styles.title}>{title}</Text>
        </View>

        {rightIcon ? (
          <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
            <Feather name={rightIcon} size={22} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.primary,
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  iconPlaceholder: {
    width: 36,
  },
});
