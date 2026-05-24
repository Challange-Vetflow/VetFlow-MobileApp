import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackRoutes from './stack.routes'; // Importa o fluxo de Cadastro -> Perfil

export default function Routes() {
  return (
    <NavigationContainer>
      {/* Iniciamos pelo StackRoutes para cumprir o requisito de tela inicial de Cadastro */}
      <StackRoutes />
    </NavigationContainer>
  );
}