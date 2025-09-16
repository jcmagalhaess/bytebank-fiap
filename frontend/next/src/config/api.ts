// Detecta automaticamente a URL da API no navegador
const resolveBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Se existir NEXT_PUBLIC_API_URL, usa ela
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    // Usa o host atual com porta 3000 para acessar o backend via navegador
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:8080`;
  }
  // Em SSR/Build, usa env ou localhost
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
};

export const API_CONFIG = {
  BASE_URL: resolveBaseUrl(),
  ENDPOINTS: {
    ACCOUNT: "/account",
    TRANSACTION: "/account/transaction",
    STATEMENT: (accountId: string) => `/account/${accountId}/statement`, // Agora aceita accountId como parâmetro
    LOGIN: "/user/auth",
    REGISTER: "/user",
    USERS: "/user",
  },
};

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
