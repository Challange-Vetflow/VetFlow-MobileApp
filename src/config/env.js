// src/config/env.js
// Configuração central de ambiente da aplicação.

export const BASE_URL = 'http://10.0.2.2:8080/api';
// export const BASE_URL = 'http://10.0.2.2:8080/api';      // Emulador Android → API local
// export const BASE_URL = 'http://192.168.0.X:8080/api';   // Dispositivo físico → IP da máquina
// export const BASE_URL = 'https://vetflow-api-production.up.railway.app/api'; // Produção

export const REQUEST_TIMEOUT_MS = 20000;

export default {
  BASE_URL,
  REQUEST_TIMEOUT_MS,
};
