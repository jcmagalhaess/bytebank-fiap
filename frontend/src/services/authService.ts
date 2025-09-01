import { ApiService } from './api';
import { API_CONFIG } from '../config/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<any>(
        API_CONFIG.ENDPOINTS.LOGIN,
        credentials
      );

      // O token está em response.result.token baseado na estrutura da API
      if (!response.result?.token) {
        throw new Error('Token não recebido do servidor');
      }

      // Salva o token no localStorage
      ApiService.setAuthToken(response.result.token);

      return {
        token: response.result.token,
        user: response.result.user
      };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<any>(
        API_CONFIG.ENDPOINTS.REGISTER,
        userData
      );

      // O registro não retorna token, apenas confirmação
      // Para obter token, precisa fazer login após o registro
      return {
        token: '',
        user: response.result
      };
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  static logout(): void {
    ApiService.removeAuthToken();
    // Limpa outros dados do usuário se necessário
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_data');
    }
  }

  static isAuthenticated(): boolean {
    return ApiService.isAuthenticated();
  }

  static getToken(): string | null {
    return ApiService.getAuthToken();
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      const response = await ApiService.get<any[]>(API_CONFIG.ENDPOINTS.USERS);
      // Retorna a lista de usuários da API
      return response.result?.[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  }

  // Método para verificar se o token ainda é válido
  static async validateToken(): Promise<boolean> {
    try {
      if (!this.isAuthenticated()) {
        return false;
      }

      // Faz uma requisição simples para verificar se o token ainda é válido
      await ApiService.get(API_CONFIG.ENDPOINTS.ACCOUNT);
      return true;
    } catch (error) {
      console.warn('Token inválido:', error);
      this.logout();
      return false;
    }
  }
}
