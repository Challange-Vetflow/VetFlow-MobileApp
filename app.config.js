// app.config.js
// Configuração DINÂMICA do Expo — complementa o app.json.
//
// Aqui injetamos em `extra` o HASH DO COMMIT de onde o app foi gerado, exibido
// na tela "Sobre o App". Assim o professor consegue conferir que o app
// publicado no Firebase App Distribution corresponde exatamente ao código
// entregue no repositório.
//
// Ordem de descoberta do hash:
//   1. EAS_BUILD_GIT_COMMIT_HASH (definido pelo EAS Build na nuvem)
//   2. COMMIT_HASH (se você quiser forçar manualmente: COMMIT_HASH=abc123 ...)
//   3. `git rev-parse HEAD` (build local / expo start)
// Se houver alterações não commitadas, o hash recebe o sufixo "-dirty" — um
// aviso de que o app NÃO corresponde a nenhum commit (commite antes de gerar o APK!).

const { execSync } = require('child_process');

function git(comando) {
  try {
    return execSync(`git ${comando}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}

module.exports = ({ config }) => {
  const hashCompleto =
    process.env.EAS_BUILD_GIT_COMMIT_HASH || process.env.COMMIT_HASH || git('rev-parse HEAD') || 'indisponivel';
  const alterado = !process.env.EAS_BUILD_GIT_COMMIT_HASH && !!git('status --porcelain');
  const branch = process.env.EAS_BUILD_GIT_BRANCH || git('rev-parse --abbrev-ref HEAD') || 'desconhecida';

  return {
    ...config,
    extra: {
      ...(config.extra || {}),
      commitHash: alterado ? `${hashCompleto}-dirty` : hashCompleto,
      commitBranch: branch,
      buildDate: new Date().toISOString(),
    },
  };
};
