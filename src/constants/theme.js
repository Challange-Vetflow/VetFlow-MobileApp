// src/constants/theme.js
// Identidade visual do VetFlow — acompanhamento de saúde de pets

export const COLORS = {
  // Cores primárias
  background: '#F4FBF9',      // Fundo geral (verde-água bem claro)
  surface: '#FFFFFF',         // Superfície de cards
  surfaceAlt: '#EAF6F3',      // Cards/seções alternativas
  primary: '#2A9D8F',         // Verde-teal (marca VetFlow)
  primaryDark: '#1F776C',     // Verde-teal escuro (pressed/headers)
  secondary: '#FF8C61',       // Coral (ações de destaque / lembretes)
  secondaryDark: '#E06B3F',   // Coral escuro

  // Tipos de registro de saúde
  vacina: '#2A9D8F',          // Verde-teal
  consulta: '#5B7FDE',        // Azul
  exame: '#9B6FE0',           // Roxo

  // Severidade / status
  critical: '#E5484D',        // Vermelho (atrasado)
  warning: '#F2A93B',         // Amarelo (perto do vencimento)
  success: '#2FAE60',         // Verde (em dia)

  // Textos
  textPrimary: '#1C2B27',     // Quase preto esverdeado
  textSecondary: '#5B6E68',   // Cinza-verde médio
  textMuted: '#8FA39D',       // Cinza-verde claro

  // Bordas
  border: '#DCEAE6',
  borderLight: '#EAF6F3',

  // Overlay
  overlay: 'rgba(15, 35, 30, 0.55)',
  white: '#FFFFFF',
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
    shadowColor: '#0F2A24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};
