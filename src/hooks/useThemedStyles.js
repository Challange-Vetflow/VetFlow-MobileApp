// src/hooks/useThemedStyles.js
// Gera os estilos de um componente a partir da paleta do tema ativo.
//
// Uso:
//   const createStyles = (COLORS) => StyleSheet.create({ ... });
//   const styles = useThemedStyles(createStyles);
//
// `createStyles` precisa ficar no escopo do módulo (referência estável) —
// os estilos só são recalculados quando o tema muda.

import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function useThemedStyles(createStyles) {
  const { colors } = useTheme();
  return useMemo(() => createStyles(colors), [colors, createStyles]);
}
