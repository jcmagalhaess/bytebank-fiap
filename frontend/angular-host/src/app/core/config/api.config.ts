import { isDevMode } from '@angular/core';

const getBaseUrl = (): string => {
  // Quando rodando localmente (Docker), aponta para a API na porta 3333.
  if (isDevMode()) {
    return 'http://localhost:3333';
  }
  // Em produção (Vercel), usa um caminho relativo para o proxy.
  return '/api';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    LOGIN: 'users/login',
    REGISTER: 'users',
    ACCOUNT: 'users/me',
    TRANSACTIONS: 'transactions',
    SUMMARY: 'transactions/summary',
    YEARLY_SUMMARY: 'transactions/yearly-summary',
  },
};
