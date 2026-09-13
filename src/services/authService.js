// src/services/authService.js
// Autenticação (/api/auth/**) contra a API Java real do grupo.

import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { STORAGE_KEYS } from './api';

export const authService = {
  /** POST /api/auth/login — a API espera literalmente { email, senha } */
  login: ({ email, senha }) => api.post('/auth/login', { email, senha }),

  /** POST /api/auth/register — a API espera { name, email, phone, password } */
  registrar: ({ nome, email, telefone, senha }) =>
    api.post('/auth/register', { name: nome, email, phone: telefone, password: senha }),

  /** GET /api/auth/me → usuário da sessão atual (usado para restaurar login no boot) */
  me: () => api.get('/auth/me'),

  /** POST /api/auth/logout → encerra a sessão no servidor */
  logout: () => api.post('/auth/logout'),
};

// ─────────────────────────────────────────────────
// CACHE LOCAL DO PERFIL (AsyncStorage) — não é a sessão em si
// ─────────────────────────────────────────────────
export async function salvarUsuarioCache(usuario) {
  await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(usuario));
}

export async function limparUsuarioCache() {
  await AsyncStorage.removeItem(STORAGE_KEYS.USER);
}

export async function getUsuarioCache() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
}

/**
 * Normaliza o payload real da API ({ id, nome, email, role, tutorId }) para
 * o formato usado no app. `tutorId` pode chegar como "" (string vazia) para
 * usuários sem tutor vinculado (ex.: role VET) — tratamos isso como null.
 */
export function mapAuthResponse(data) {
  if (!data) return null;
  const tutorIdBruto = data.tutorId;
  const tutorId =
    tutorIdBruto === '' || tutorIdBruto == null ? null : Number(tutorIdBruto);

  return {
    userId: data.id,
    nome: data.nome,
    email: data.email,
    role: data.role,
    tutorId,
  };
}

export default authService;
