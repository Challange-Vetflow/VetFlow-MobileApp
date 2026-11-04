// src/config/buildInfo.js
// Informações de build exibidas em "Sobre o App". O hash do commit é injetado
// em tempo de build pelo app.config.js.

import Constants from 'expo-constants';
import { BASE_URL } from './env';

const extra = Constants.expoConfig?.extra ?? {};
const hash = extra.commitHash || 'indisponivel';

export const BUILD_INFO = {
  nome: Constants.expoConfig?.name ?? 'VetFlow',
  versao: Constants.expoConfig?.version ?? '0.0.0',
  commitHash: hash,
  commitCurto: hash.slice(0, 7) + (hash.endsWith('-dirty') ? '*' : ''),
  branch: extra.commitBranch ?? 'desconhecida',
  dataBuild: extra.buildDate ?? null,
  ambiente: __DEV__ ? 'Desenvolvimento' : 'Produção',
  apiUrl: BASE_URL,
};

export default BUILD_INFO;
