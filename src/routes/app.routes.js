// src/routes/app.routes.js
// Stack principal — montada apenas quando HÁ usuário autenticado.
// Envolve as Tabs e as telas de detalhe/formulário que ficam "por cima" delas.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabRoutes from './tab.routes';
import PetDetalhe from '../screens/pets/PetDetalhe';
import PetForm from '../screens/pets/PetForm';
import VaccineForm from '../screens/vaccines/VaccineForm';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabRoutes} options={{ animation: 'fade' }} />
      <Stack.Screen name="PetDetalhe" component={PetDetalhe} />
      <Stack.Screen name="PetForm" component={PetForm} />
      <Stack.Screen name="VaccineForm" component={VaccineForm} />
    </Stack.Navigator>
  );
}
