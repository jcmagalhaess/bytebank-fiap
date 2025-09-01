export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    ACCOUNT: '/account',
    TRANSACTION: '/account/transaction',
    STATEMENT: (accountId: string) => `/account/${accountId}/statement`,
    LOGIN: '/user/auth',
    REGISTER: '/user',
    USERS: '/user'
  }
};

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
