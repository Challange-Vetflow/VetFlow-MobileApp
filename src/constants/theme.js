// src/constants/theme.js
// Identidade visual do VetFlow — paletas CLARA e ESCURA.
//
// As cores NÃO são mais uma constante única: cada tema tem sua paleta e a
// paleta ativa é fornecida pelo ThemeContext (ver src/contexts/ThemeContext.js).
// Nos componentes, use `useTheme()` (cores) e `useThemedStyles(createStyles)`
// (estilos que dependem do tema). FONTS/SPACING/RADIUS/SHADOW são iguais
// nos dois temas.

export const LIGHT_COLORS = {
  background: '#F4FBF9',
  surface: '#FFFFFF',
  surfaceAlt: '#EAF6F3',
  header: '#2A9D8F',          // fundo do cabeçalho
  primary: '#2A9D8F',
  primaryDark: '#1F776C',
  secondary: '#FF8C61',
  secondaryDark: '#E06B3F',

  vacina: '#2A9D8F',
  consulta: '#5B7FDE',
  exame: '#9B6FE0',

  critical: '#E5484D',
  warning: '#D98A0B',
  success: '#2FAE60',

  textPrimary: '#1C2B27',
  textSecondary: '#5B6E68',
  textMuted: '#8FA39D',

  border: '#DCEAE6',
  borderLight: '#EAF6F3',
  overlay: 'rgba(15, 35, 30, 0.55)',

  white: '#FFFFFF',
  onPrimary: '#FFFFFF',       // texto/ícone sobre fundo "primary"
};

export const DARK_COLORS = {
  background: '#0E1816',
  surface: '#16231F',
  surfaceAlt: '#1E302B',
  header: '#12332D',
  primary: '#3FC1AF',
  primaryDark: '#2A9D8F',
  secondary: '#FF9C74',
  secondaryDark: '#E06B3F',

  vacina: '#3FC1AF',
  consulta: '#7C9BF0',
  exame: '#B692F0',

  critical: '#FF6B6F',
  warning: '#F5B650',
  success: '#4CC77A',

  textPrimary: '#E8F3F0',
  textSecondary: '#A9BDB7',
  textMuted: '#7B918B',

  border: '#27403A',
  borderLight: '#1E302B',
  overlay: 'rgba(0, 0, 0, 0.65)',

  white: '#FFFFFF',
  onPrimary: '#06201C',
};

export const FONTS = {
  regular: 'System',
  bold: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 100,
};

export const SHADOW = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};
