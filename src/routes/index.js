// src/routes/index.js
// Ponto de entrada da navegação.
//
// PROTEÇÃO DE ROTAS: enquanto `isAuthenticated` for false, a árvore de
// navegação só contém as telas de Login/Cadastro (AuthRoutes) — as telas
// internas (Pets, Lembretes, Perfil etc.) sequer existem no navigator, então
// não há como "pular" para elas por navegação direta, atalho ou notificação.
// Assim que o login é concluído, o AuthContext atualiza `isAuthenticated` e o
// AppRoutes é montado no lugar.

import React, { useMemo } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LoadingOverlay from '../components/LoadingOverlay';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import { navigationRef } from './navigationRef';

export default function Routes() {
  const { isAuthenticated, carregandoSessao } = useAuth();
  const { colors, isDark } = useTheme();

  // Tema do React Navigation alinhado à paleta do app (evita "flash" branco no modo escuro).
  const navTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
      },
    };
  }, [colors, isDark]);

  if (carregandoSessao) {
    // Sessão sendo restaurada do AsyncStorage — evita "piscar" a tela de login.
    return <LoadingOverlay mensagem="Preparando o VetFlow..." />;
  }

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
