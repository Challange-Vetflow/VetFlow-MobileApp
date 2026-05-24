import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Cadastro from '../screens/Cadastro';
import Perfil from '../screens/Perfil';
import Historico from '../screens/Historico';
import Lembretes from '../screens/Lembretes';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false // Remove o cabeçalho padrão para um visual mais limpo
      }}
    >
      {/* Tela inicial do fluxo de cadastro */}
      <Stack.Screen 
        name="Cadastro" 
        component={Cadastro} 
      />
      
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Historico" component={Historico} />
      <Stack.Screen name="Lembretes" component={Lembretes} />
    </Stack.Navigator>
  );
}
