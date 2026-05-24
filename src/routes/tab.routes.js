import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

// Importações com caminhos corrigidos
import Perfil from '../screens/Perfil';
import Historico from '../screens/Historico';
import Lembretes from '../screens/Lembretes';

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Perfil" 
        component={Perfil} 
        options={{ tabBarIcon: ({color, size}) => <Feather name="user" color={color} size={size} /> }}
      />
      <Tab.Screen 
        name="Historico" 
        component={Historico} 
        options={{ tabBarIcon: ({color, size}) => <Feather name="list" color={color} size={size} /> }}
      />
      <Tab.Screen 
        name="Lembretes" 
        component={Lembretes} 
        options={{ tabBarIcon: ({color, size}) => <Feather name="bell" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}