// src/services/queryClient.js
// Instância única do QueryClient (TanStack Query), compartilhada por todo o app.

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30, // 30s — dados recentes não refazem fetch à toa
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
