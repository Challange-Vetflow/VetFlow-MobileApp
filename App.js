// App.js
// Componente raiz do VetFlow — ponto de entrada do Expo

import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './src/services/queryClient';
import { AuthProvider } from './src/contexts/AuthContext';
import Routes from './src/routes';
import { COLORS } from './src/constants/theme';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" backgroundColor={COLORS.background} />
          {/*
            Routes: NavigationContainer + Auth/App routes
            Fluxo: Login → (Cadastro) → MainTabs → (PetDetalhe | PetForm | VaccineForm)
          */}
          <Routes />
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
