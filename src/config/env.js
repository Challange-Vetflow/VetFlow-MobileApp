// src/config/env.js
// Configuração central de ambiente da aplicação.
//
// A URL da API vem da variável EXPO_PUBLIC_API_URL (definida em eas.json para
// o APK publicado, ou em um arquivo .env para desenvolvimento). Sem ela, usa
// o endereço padrão de desenvolvimento local:
//   - Emulador Android → 10.0.2.2 (alias do emulador para o localhost do PC)
//   - iOS simulator / web → localhost
//   - Celular físico → defina EXPO_PUBLIC_API_URL=http://IP-DO-SEU-PC:8080/api

const URL_DESENVOLVIMENTO = 'https://vetflow-java.onrender.com/api';

export const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || URL_DESENVOLVIMENTO).replace(/\/+$/, '');

export const REQUEST_TIMEOUT_MS = 20000;

export default {
  BASE_URL,
  REQUEST_TIMEOUT_MS,
};
