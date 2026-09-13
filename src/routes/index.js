// src/routes/index.js
// Ponto de entrada da navegação.
//
// Esta é a peça que garante a PROTEÇÃO DE ROTAS exigida pelo Sprint 3:
// enquanto `isAuthenticated` for false, a árvore de navegação só contém as
// telas de Login/Cadastro (AuthRoutes) — as telas internas (Pets, Lembretes,
// Perfil etc.) sequer existem no navigator, então não há como "pular" para
// elas por navegação direta ou deep link. Assim que o login é concluído, o
// AuthContext atualiza `isAuthenticated` e o AppRoutes é montado no lugar.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../contexts/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

export default function Routes() {
  const { isAuthenticated, carregandoSessao } = useAuth();

  if (carregandoSessao) {
    // Sessão sendo restaurada do AsyncStorage — evita "piscar" a tela de login.
    return <LoadingOverlay mensagem="Preparando o VetFlow..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
