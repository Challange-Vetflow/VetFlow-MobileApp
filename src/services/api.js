// src/services/api.js
// Camada de serviço: toda a comunicação HTTP com a API Java (Spring Boot).
//
// INTEGRAÇÃO REAL (API VetFlow em Java): a API usa Spring Security com
// autenticação por FORMULÁRIO + SESSÃO (cookie JSESSIONID) — não por token
// JWT. Por isso:
//   - `withCredentials: true` garante que o cookie de sessão seja enviado
//     em toda requisição (no React Native, o cookie também é gerenciado
//     automaticamente pela camada nativa de rede, mas mantemos a flag para
//     also funcionar via Expo Web).
//   - Não existe header "Authorization: Bearer" — a sessão é o próprio
//     cookie, obtido via POST /api/auth/login (ver authService.js).
//
// Os endpoints e nomes de campos abaixo foram conferidos diretamente no
// código-fonte da API (PetController, VaccineController, AuthApiController).

import axios from 'axios';
import { BASE_URL, REQUEST_TIMEOUT_MS } from '../config/env';

export const STORAGE_KEYS = {
  USER: '@vetflow:usuario',
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─────────────────────────────────────────────────
// INTERCEPTOR DE RESPOSTA
// ─────────────────────────────────────────────────
// Callback plugado pelo AuthContext para reagir a uma sessão expirada (401),
// derrubando o usuário de volta para a tela de login.
let onSessaoExpirada = null;
export function registrarHandlerSessaoExpirada(handler) {
  onSessaoExpirada = handler;
}

// Como a API usa Spring Security com `formLogin()` (não JWT), quando a
// sessão não é reconhecida em um endpoint de /api/** protegido, o servidor
// não responde 401 — ele redireciona (302) para a página HTML de login.
// O axios segue esse redirecionamento automaticamente e recebe um 200 OK
// com o HTML da tela de login como corpo da resposta. Sem este tratamento,
// esse HTML (uma string) seria devolvido no lugar do JSON esperado (ex.:
// um array de pets) e quebraria mais adiante com erros como
// "pets.map is not a function" — detectamos esse caso aqui e tratamos como
// sessão inválida.
function isPaginaHtmlDeLogin(response) {
  return typeof response?.data === 'string' && /<html/i.test(response.data);
}

api.interceptors.response.use(
  (response) => {
    if (isPaginaHtmlDeLogin(response)) {
      console.error(
        '[API] Resposta HTML recebida em vez de JSON — provável sessão expirada/redirecionamento para /login em',
        response.config?.url,
      );
      if (onSessaoExpirada) onSessaoExpirada();
      const erro = new Error('Sessão inválida ou expirada. Faça login novamente.');
      erro.isSessaoInvalida = true;
      return Promise.reject(erro);
    }
    return response;
  },
  async (error) => {
    if (error.response) {
      console.error('[API Error]', error.response.status, error.response.data);
      // Ignora 401 do próprio /auth/me — é o fluxo normal de "não logado ainda".
      const isCheckDeSessao = error.config?.url?.includes('/auth/me');
      if (error.response.status === 401 && !isCheckDeSessao && onSessaoExpirada) {
        onSessaoExpirada();
      }
    } else if (error.request) {
      console.error('[API] Sem resposta do servidor. Verifique a URL (env.js) e a conexão.');
    } else {
      console.error('[API] Erro ao configurar requisição:', error.message);
    }
    return Promise.reject(error);
  },
);

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
/**
 * Normaliza respostas paginadas do Spring (Page<T>), usadas por alguns
 * endpoints (ex.: GET /api/tutors). A maioria dos endpoints usados pelo app
 * (by-tutor, by-pet, vaccines) já retorna array puro.
 */
export function extractContent(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  return [];
}

export default api;