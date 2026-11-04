// app.config.js

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
