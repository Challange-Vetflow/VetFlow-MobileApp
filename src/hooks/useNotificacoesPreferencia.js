// src/hooks/useNotificacoesPreferencia.js
// Preferência "Notificações de lembrete" (Perfil): liga/desliga e cuida de
// permissão e cancelamento dos lembretes agendados.

import { useCallback, useEffect, useState } from 'react';
import * as notificacoes from '../services/notificationService';
import { reminderService } from '../services/reminderService';

export function useNotificacoesPreferencia() {
  const [ativo, setAtivo] = useState(true);
  const [permitido, setPermitido] = useState(true);

  useEffect(() => {
    (async () => {
      setAtivo(await notificacoes.notificacoesAtivas());
      setPermitido(await notificacoes.permissaoConcedida());
    })();
  }, []);

  /** Retorna { ok, motivo } — motivo 'permissao' quando o SO bloqueou as notificações. */
  const alternar = useCallback(async (novoValor) => {
    if (novoValor) {
      await notificacoes.definirNotificacoesAtivas(true);
      const concedida = await notificacoes.solicitarPermissao();
      setPermitido(concedida);
      setAtivo(true);
      return concedida ? { ok: true } : { ok: false, motivo: 'permissao' };
    }
    await notificacoes.definirNotificacoesAtivas(false);
    await reminderService.cancelarTudo();
    setAtivo(false);
    return { ok: true };
  }, []);

  return { ativo: ativo && permitido, alternar };
}
