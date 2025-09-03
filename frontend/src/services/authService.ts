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
    // NÃO limpa as transações do usuário para manter persistência
    // As transações ficam no localStorage para serem recuperadas no próximo login
    
    ApiService.removeAuthToken();
    // Limpa apenas dados de autenticação
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');
    }
  }

  static isAuthenticated(): boolean {
    return ApiService.isAuthenticated();
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      // Decodifica o token para obter informações do usuário
      const token = this.getToken();
      if (!token) {
        return null;
      }

      // Decodifica o JWT para obter os dados do usuário
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      return {
        id: payload.id,
        username: payload.username,
        email: payload.email
      };
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
