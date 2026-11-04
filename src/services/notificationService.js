// src/services/notificationService.js
// Wrapper fino sobre o expo-notifications: canal Android, permissão,
// agendamento, disparo imediato, cancelamento e preferências do usuário.
// Não contém regra de negócio — as regras ficam em reminderPlanner.js.

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CHANNEL_ID = 'vetflow-lembretes';
const PREF_KEY = '@vetflow:notificacoes';
const RESUMO_KEY = '@vetflow:resumo-notificado';

// Mostra a notificação mesmo com o app aberto (primeiro plano).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configurarCanal() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Lembretes de saúde do pet',
    description: 'Vacinas e consultas dos seus pets',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#2A9D8F',
  });
}

export async function permissaoConcedida() {
  const atual = await Notifications.getPermissionsAsync();
  return !!atual.granted;
}

/** Pede permissão ao usuário (Android 13+/iOS). Retorna true se concedida. */
export async function solicitarPermissao() {
  const atual = await Notifications.getPermissionsAsync();
  if (atual.granted) return true;
  if (!atual.canAskAgain) return false;
  const resposta = await Notifications.requestPermissionsAsync();
  return !!resposta.granted;
}

// ── Preferência do usuário (Perfil > Notificações) ──
export async function notificacoesAtivas() {
  const valor = await AsyncStorage.getItem(PREF_KEY);
  return valor !== 'false';
}

export async function definirNotificacoesAtivas(ativo) {
  await AsyncStorage.setItem(PREF_KEY, String(ativo));
}

// ── Agendamento / disparo ──
/** Agenda uma notificação local para uma data futura (id determinístico = idempotente). */
export async function agendar({ id, titulo, corpo, quando, data }) {
  return Notifications.scheduleNotificationAsync({
    identifier: id,
    content: { title: titulo, body: corpo, data, sound: true, color: '#2A9D8F' },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: quando,
      channelId: CHANNEL_ID,
    },
  });
}

/** Dispara uma notificação local imediatamente. */
export async function disparar({ titulo, corpo, data }) {
  return Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: corpo, data, sound: true, color: '#2A9D8F' },
    trigger: Platform.OS === 'android' ? { channelId: CHANNEL_ID } : null,
  });
}

async function cancelarOnde(predicado) {
  const agendadas = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    agendadas
      .filter(predicado)
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
}

export const cancelarPorPrefixo = (prefixo) =>
  cancelarOnde((n) => n.identifier.startsWith(prefixo));

export const cancelarPorPet = (petId) =>
  cancelarOnde((n) => n.content?.data?.petId === petId);

export async function cancelarTodas() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.dismissAllNotificationsAsync();
  await AsyncStorage.removeItem(RESUMO_KEY);
}

// ── Controle para não repetir o resumo no mesmo dia ──
export async function resumoJaEnviado(chave) {
  return (await AsyncStorage.getItem(RESUMO_KEY)) === chave;
}

export async function marcarResumoEnviado(chave) {
  await AsyncStorage.setItem(RESUMO_KEY, chave);
}
