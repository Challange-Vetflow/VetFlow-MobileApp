// src/utils/notificationNavigation.js
// Decide PARA ONDE o app navega quando o usuário toca em uma notificação,
// a partir do `data` que o reminderPlanner anexou a ela.

export function destinoDaNotificacao(data) {
  if (!data || !data.tipo) return null;
  if ((data.tipo === 'vacina' || data.tipo === 'consulta') && data.petId) {
    return { nome: 'PetDetalhe', params: { petId: data.petId } };
  }
  if (data.tipo === 'resumo') {
    return { nome: 'MainTabs', params: { screen: 'Lembretes' } };
  }
  return null;
}
