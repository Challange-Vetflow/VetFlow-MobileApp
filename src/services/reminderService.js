// src/services/reminderService.js
// Orquestra os lembretes: junta as REGRAS (reminderPlanner) com a EXECUÇÃO
// (notificationService). É chamado pelos hooks de dados quando o usuário
// cria/edita/remove vacinas e consultas, e pela sincronização ao abrir o app.
//
// Nenhuma falha de notificação pode quebrar o CRUD — por isso tudo é
// protegido por try/catch e apenas registra um aviso no console.

import * as notificacoes from './notificationService';
import {
  planejarLembretesVacina,
  planejarLembretesConsulta,
  planejarResumo,
  idVacina,
  idConsulta,
} from './reminderPlanner';
import { formatarData, formatarDataHora } from '../utils/dateUtils';
import { TIPOS_CONSULTA } from '../constants/appointmentTypes';

// Lembretes são do TUTOR (dono do pet). Quem registra vacinas é a clínica (VET): no
// aparelho dela não faz sentido agendar lembretes dos pets dos clientes.
let perfilAtual = null;

async function podeNotificar() {
  if (perfilAtual !== 'TUTOR') return false;
  return (await notificacoes.notificacoesAtivas()) && (await notificacoes.permissaoConcedida());
}

async function seguro(nome, fn) {
  try {
    return await fn();
  } catch (erro) {
    console.warn(`[Lembretes] falha em ${nome}:`, erro?.message || erro);
    return undefined;
  }
}

async function agendarTodos(lembretes) {
  for (const l of lembretes) {
    await notificacoes.agendar(l);
  }
}

export const reminderService = {
  /** Informa o perfil do usuário logado ('TUTOR' | 'VET') — só TUTOR recebe lembretes. */
  definirPerfil: (role) => {
    perfilAtual = role;
  },

  /** Cria o canal Android e pede permissão (chamado ao entrar no app autenticado). */
  inicializar: () =>
    seguro('inicializar', async () => {
      await notificacoes.configurarCanal();
      if (perfilAtual !== 'TUTOR') return false;
      if (!(await notificacoes.notificacoesAtivas())) return false;
      return notificacoes.solicitarPermissao();
    }),

  /** Vacina criada/editada: reagenda véspera + dia da dose e confirma ao usuário. */
  aoSalvarVacina: (vacina, nomePet) =>
    seguro('aoSalvarVacina', async () => {
      await notificacoes.cancelarPorPrefixo(`vacina-${vacina.id}-`);
      if (!(await podeNotificar())) return;
      await agendarTodos(planejarLembretesVacina(vacina, nomePet));
      await notificacoes.disparar({
        titulo: '✅ Vacina registrada',
        corpo: `${vacina.vaccineName} de ${nomePet}. Próxima dose em ${formatarData(vacina.nextDoseAt)} — vamos te lembrar!`,
        data: { tipo: 'vacina', petId: vacina.petId, vaccineId: vacina.id },
      });
    }),

  aoRemoverVacina: (vacinaId) =>
    seguro('aoRemoverVacina', () => notificacoes.cancelarPorPrefixo(idVacina(vacinaId, ''))),

  /** Consulta criada/editada: agenda 24h e 1h antes e confirma ao usuário. */
  aoSalvarConsulta: (consulta, nomePet) =>
    seguro('aoSalvarConsulta', async () => {
      await notificacoes.cancelarPorPrefixo(idConsulta(consulta.id, ''));
      if (!(await podeNotificar())) return;
      await agendarTodos(planejarLembretesConsulta(consulta, nomePet));
      const tipo = TIPOS_CONSULTA[consulta.type]?.label || 'Consulta';
      await notificacoes.disparar({
        titulo: '✅ Consulta agendada',
        corpo: `${tipo} de ${nomePet} em ${formatarDataHora(consulta.scheduledAt)}. Avisaremos antes!`,
        data: { tipo: 'consulta', petId: consulta.petId, appointmentId: consulta.id },
      });
    }),

  /** Consulta concluída ou removida: cancela os lembretes pendentes dela. */
  aoEncerrarConsulta: (consultaId) =>
    seguro('aoEncerrarConsulta', () => notificacoes.cancelarPorPrefixo(idConsulta(consultaId, ''))),

  aoRemoverPet: (petId) =>
    seguro('aoRemoverPet', () => notificacoes.cancelarPorPet(petId)),

  /**
   * Sincroniza com os dados atuais da API (ao abrir o app / atualizar):
   * reagenda os lembretes dos próximos itens e envia o resumo do dia
   * (vacinas atrasadas / próximos 7 dias) — uma vez por dia por conteúdo.
   */
  sincronizar: (lembretes) =>
    seguro('sincronizar', async () => {
      if (!(await podeNotificar())) return;

      for (const v of lembretes.vacinas) {
        await agendarTodos(planejarLembretesVacina(v, v.petName));
      }
      for (const c of lembretes.consultas) {
        await agendarTodos(planejarLembretesConsulta(c, c.petName));
      }

      const resumo = planejarResumo(lembretes);
      if (resumo && !(await notificacoes.resumoJaEnviado(resumo.chave))) {
        await notificacoes.disparar(resumo);
        await notificacoes.marcarResumoEnviado(resumo.chave);
      }
    }),

  /** Logout / exclusão de conta / desativar notificações. */
  cancelarTudo: () => seguro('cancelarTudo', () => notificacoes.cancelarTodas()),
};

export default reminderService;
