// src/utils/apiError.js
// Extrai mensagens legíveis dos erros da API Java.
//
// Formatos reais da API:
//  - ApiError (todos os controllers REST):
//      { timestamp, status, erro, mensagem, caminho, codigoOracle?, campos? }
//      `campos` = { nomeDoCampo: 'mensagem' } nos erros de validação (400);
//      `mensagem` traz o texto das procedures Oracle (ex.: "E-mail já cadastrado: x").
//  - /api/auth/login e /me (401): { erro: 'texto' }
//  - Sem sessão em /api/**: 401 sem corpo.

/** Campos de validação do servidor (ex.: { name: '...', birthDate: '...' }) ou {}. */
export function camposDoErro(error) {
  const campos = error?.response?.data?.campos;
  return campos && typeof campos === 'object' ? campos : {};
}

/** Mensagem principal do erro, com `fallback` quando a API não informa nada útil. */
export function mensagemDeErro(error, fallback = 'Não foi possível concluir a operação. Tente novamente.') {
  if (error?.isSessaoInvalida) return 'Sua sessão expirou. Faça login novamente.';

  const status = error?.response?.status;
  const data = error?.response?.data;

  if (!error?.response) {
    return 'Sem conexão com o servidor. Verifique sua internet e a URL da API.';
  }

  const campos = Object.values(camposDoErro(error));
  if (campos.length) return campos.join('\n');

  const texto = typeof data === 'object' && data ? data.mensagem || data.erro || data.message : null;
  if (texto && texto !== 'Dados inválidos.') return texto;

  if (status === 401) return 'Sessão inválida ou credenciais incorretas.';
  if (status === 403) return 'Você não tem permissão para realizar esta ação.';
  if (status === 404) return 'Registro não encontrado.';
  if (status >= 500) return 'O servidor encontrou um problema. Tente novamente em instantes.';
  return fallback;
}
