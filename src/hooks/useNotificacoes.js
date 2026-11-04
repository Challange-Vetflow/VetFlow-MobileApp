// src/hooks/useNotificacoes.js
// Liga o sistema de notificações ao app autenticado (montado em AppRoutes):
//  1. Inicializa canal + permissão.
//  2. Sincroniza lembretes com os dados da API ao abrir/atualizar o app.
//  3. Ao TOCAR numa notificação (app em foreground, background ou fechado),
//     leva o usuário à tela relevante (detalhe do pet ou aba Lembretes).

import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { reminderService } from '../services/reminderService';
import { navegar } from '../routes/navigationRef';
import { destinoDaNotificacao } from '../utils/notificationNavigation';
import { useLembretes } from './useLembretes';

function useSincronizacaoDeLembretes() {
  const lembretes = useLembretes();
  const { pronto, vacinas, consultas } = lembretes;

  useEffect(() => {
    if (pronto) reminderService.sincronizar(lembretes);
  }, [pronto, vacinas, consultas]);
}

function useNavegacaoPorNotificacao() {
  // Cobre os 3 cenários: tocar com app aberto, em background e app fechado (cold start).
  const ultimaResposta = Notifications.useLastNotificationResponse();
  const jaTratada = useRef(null);

  useEffect(() => {
    if (!ultimaResposta) return;
    const { notification } = ultimaResposta;
    const marca = `${notification.request.identifier}:${notification.date}`;
    if (jaTratada.current === marca) return;
    jaTratada.current = marca;

    const destino = destinoDaNotificacao(notification.request.content.data);
    if (destino) navegar(destino.nome, destino.params);
  }, [ultimaResposta]);
}

export function useNotificacoes() {
  useEffect(() => {
    reminderService.inicializar();
  }, []);
  useSincronizacaoDeLembretes();
  useNavegacaoPorNotificacao();
}
