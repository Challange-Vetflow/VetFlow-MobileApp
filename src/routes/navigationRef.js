// src/routes/navigationRef.js
// Referência global do NavigationContainer — permite navegar a partir de
// fora de componentes de tela (ex.: ao tocar em uma notificação).

import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/** Navega com segurança: se o container ainda não montou, tenta de novo por alguns segundos. */
export function navegar(nome, params, tentativas = 20) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(nome, params);
    return;
  }
  if (tentativas > 0) {
    setTimeout(() => navegar(nome, params, tentativas - 1), 300);
  }
}
