// src/contexts/AuthContext.js
// Contexto global de autenticação.
//
// Responsável por:
//  - Restaurar a sessão ao abrir o app: como a API usa cookie de sessão
//    (não JWT), a fonte da verdade é o servidor — chamamos GET /api/auth/me
//    no boot. Se o cookie ainda for válido, a API confirma o usuário e a
//    sessão é restaurada sem pedir login novamente. Se a checagem falhar
//    por rede (não por 401), usamos o cache local como fallback otimista,
//    para não derrubar o usuário por uma instabilidade momentânea.
//  - Expor login / registrar / logout para toda a aplicação.
//  - Servir de "porteiro" da navegação: enquanto `isAuthenticated` for
//    false, só as telas de Login/Cadastro existem na árvore de navegação
//    (ver src/routes/index.js) — proteção de rotas real, não apenas visual.

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { queryClient } from '../services/queryClient';
import {
  authService,
  mapAuthResponse,
  salvarUsuarioCache,
  limparUsuarioCache,
  getUsuarioCache,
} from '../services/authService';
import { registrarHandlerSessaoExpirada } from '../services/api';
import { reminderService } from '../services/reminderService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);
  const [processando, setProcessando] = useState(false);

  // Restaura a sessão ao abrir o app, confirmando com o servidor (GET /me).
  useEffect(() => {
    (async () => {
      try {
        const response = await authService.me();
        const perfil = mapAuthResponse(response.data);
        reminderService.definirPerfil(perfil.role);
        setUsuario(perfil);
        await salvarUsuarioCache(perfil);
      } catch (error) {
        if (error?.response?.status === 401) {
          // Sessão realmente expirada/inexistente — limpa qualquer cache antigo.
          await limparUsuarioCache();
          setUsuario(null);
        } else {
          // Falha de rede/timeout: mantém a última sessão conhecida em cache
          // para não derrubar o usuário por instabilidade de conexão.
          const cache = await getUsuarioCache();
          if (cache) reminderService.definirPerfil(cache.role);
          setUsuario(cache);
        }
      } finally {
        setCarregandoSessao(false);
      }
    })();
  }, []);

  // Se a API responder 401 em qualquer chamada autenticada, derruba a sessão local.
  useEffect(() => {
    registrarHandlerSessaoExpirada(() => {
      setUsuario(null);
      limparUsuarioCache();
      queryClient.clear();
      reminderService.cancelarTudo(); // lembretes são do usuário que saiu
    });
  }, []);

  const login = useCallback(async ({ email, senha }) => {
    setProcessando(true);
    try {
      const response = await authService.login({ email, senha });
      const perfil = mapAuthResponse(response.data);
      await salvarUsuarioCache(perfil);
      reminderService.definirPerfil(perfil.role);
      setUsuario(perfil);
      return perfil;
    } finally {
      setProcessando(false);
    }
  }, []);

  const registrar = useCallback(async ({ nome, email, telefone, senha }) => {
    setProcessando(true);
    try {
      await authService.registrar({ nome, email, telefone, senha });
      // A API cria a conta (Tutor + User) mas NÃO inicia sessão: autentica em seguida
      // para obter o cookie de sessão e o perfil completo.
      const response = await authService.login({ email, senha });
      const perfil = mapAuthResponse(response.data);
      await salvarUsuarioCache(perfil);
      reminderService.definirPerfil(perfil.role);
      setUsuario(perfil);
      return perfil;
    } finally {
      setProcessando(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // mesmo se a chamada falhar (ex.: já expirada), seguimos limpando localmente
    }
    await limparUsuarioCache();
    queryClient.clear();
    await reminderService.cancelarTudo(); // não deixar lembretes de um usuário no aparelho após sair
    setUsuario(null);
  }, []);

  const value = useMemo(
    () => ({
      usuario, // { userId, nome, email, role, tutorId }
      isAuthenticated: !!usuario,
      carregandoSessao,
      processando,
      login,
      registrar,
      logout,
    }),
    [usuario, carregandoSessao, processando, login, registrar, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}

export default AuthContext;
