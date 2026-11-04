// App.js
// Componente raiz do VetFlow — ponto de entrada do Expo

import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './src/services/queryClient';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import Routes from './src/routes';

function AppShell() {
  const { isDark } = useTheme();
  return (
    <SafeAreaProvider>
      {/* Ícones da barra de status acompanham o tema (claros no escuro e vice-versa). */}
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {/*
        Routes: NavigationContainer + Auth/App routes
        Fluxo: Login → (Cadastro | Esqueci…) → MainTabs → (PetDetalhe | PetForm |
               VaccineForm | AppointmentForm | SobreApp)
      */}
      <Routes />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
