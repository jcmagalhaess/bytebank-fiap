import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { lastValueFrom } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
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
  message: string;
  result: {
    token: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
}

/**
 * Serviço responsável por gerenciar a autenticação do usuário,
 * incluindo login, logout e o estado da sessão.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _router = inject(Router);
  private _http = inject(HttpClient);

  /** Sinal que armazena as informações do usuário autenticado, ou nulo se não autenticado. */
  user = signal<User | null>(null);
  /** Sinal que indica se o usuário está atualmente autenticado. */
  isAuthenticated = signal<boolean>(false);
  /** Sinal que indica se um processo relacionado à autenticação está em andamento. */
  isLoading = signal<boolean>(true);
  /** Sinal que armazena a última mensagem de erro de autenticação, se houver. */
  error = signal<string | null>(null);

  /**
   * Processa um novo token de autenticação.
   * Armazena o token, decodifica-o para obter informações do usuário, atualiza o estado de autenticação
   * e navega para a página principal.
   * @param token A string do token JWT.
   * @private
   */
  private handleNewToken(token: string) {
    if (token) {
      localStorage.setItem('auth_token', token);
      const decodedToken = this.decodeJWTToken(token);
      this.user.set(decodedToken);
      this.isAuthenticated.set(true);
      this._router.navigate(['/']);
    }
    this.isLoading.set(false);
  }

  /**
   * Verifica a existência de um token de autenticação no armazenamento local ao iniciar a aplicação.
   * Se um token for encontrado, valida a sessão.
   */
  public async checkAuth(): Promise<void> {
    this.isLoading.set(true);
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.handleNewToken(token);
    } else {
      this.isLoading.set(false);
    }
  }

  /**
   * Tenta autenticar o usuário com as credenciais fornecidas.
   * Em caso de sucesso, armazena o token e atualiza o estado de autenticação.
   * @param credentials O email e a senha do usuário.
   */
  public async loginWithCredentials(credentials: LoginRequest): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const response = await lastValueFrom(
        this._http.post<AuthResponse>(
          `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.LOGIN}`,
          credentials
        )
      );

      if (response && response.result && response.result.token) {
        this.handleNewToken(response.result.token);
      } else {
        throw new Error('Token não recebido do servidor.');
      }
    } catch (error: any) {
      this.error.set(error.message || 'Email ou senha inválidos. Por favor, tente novamente.');
      this.isLoading.set(false);
      console.error('Erro no login:', error);
    }
  }

  /**
   * Desconecta o usuário limpando os dados da sessão e redirecionando para a página de login.
   */
  public logout() {
    this.handleLogout();
  }

  /**
   * Limpa o token de autenticação do armazenamento, redefine os sinais de usuário e autenticação,
   * e navega para a página de login.
   * @private
   */
  private handleLogout() {
    localStorage.clear();
    this.user.set(null);
    this.isAuthenticated.set(false);
    this._router.navigate(['/login']);
  }

  /**
   * Decodifica um token JWT para extrair as informações do usuário.
   * @param token A string do token JWT.
   * @returns Um objeto `User` com as informações decodificadas, ou `null` se a decodificação falhar.
   * @private
   */
  private decodeJWTToken(token: string): User | null {
    try {
      const payload = jwtDecode<any>(token);
      return {
        id: payload.sub || payload.id || 'unknown',
        username: payload.name || payload.username || 'Usuário',
        email: payload.email || 'usuario@exemplo.com',
      };
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      this.error.set('Erro ao decodificar as informações do usuário.');
      return null;
    }
  }
}
