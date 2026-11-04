// src/hooks/usePermissoes.js
// Permissões do usuário logado, espelhando as regras da API Java:
//
//  TUTOR: gerencia os PRÓPRIOS pets e consultas (criar/editar/cancelar);
//         vê vacinas, mas não as registra.
//  VET:   vê todos os pets; registra/edita/remove vacinas; conclui consultas.
//         (O cadastro de pet exige escolher o tutor — fluxo do tutor no app.)
//
// As regras valem no servidor (SecurityConfig/CurrentUser); aqui só escondemos
// no app o que a API recusaria com 403.

import { useAuth } from '../contexts/AuthContext';

export function usePermissoes() {
  const { usuario } = useAuth();
  const isVet = usuario?.role === 'VET';

  return {
    isVet,
    isTutor: !isVet,
    podeCadastrarPet: !isVet,
    podeGerenciarVacinas: isVet,
    podeConcluirConsulta: isVet,
  };
}
