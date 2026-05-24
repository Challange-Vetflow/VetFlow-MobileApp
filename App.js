// 1. Importação obrigatória para que os gestos de navegação funcionem corretamente
import 'react-native-gesture-handler';

import React from 'react';
// 2. Componentes essenciais para a interface e status do sistema
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 3. Importação do seu arquivo central de rotas (src/routes/index.js)
import Routes from './src/routes';

export default function App() {
  return (
    /**
     * SafeAreaProvider: Necessário para lidar com recortes de tela (notches) 
     * e garantir que os componentes de navegação se ajustem perfeitamente
     */
    <SafeAreaProvider>
      
      {/* 
        StatusBar: Controla a aparência da barra superior (relógio, bateria).
        O estilo "auto" ajusta as cores conforme o tema do sistema.
      */}
      <StatusBar style="auto" />

      {/* 
        Routes: O componente que carrega o NavigationContainer e define 
        qual tela (como o Cadastro) será exibida primeiro.
      */}
      <Routes />

    </SafeAreaProvider>
  );
}