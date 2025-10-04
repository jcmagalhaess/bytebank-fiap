import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
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
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Sinais privados para controle interno do estado
  private readonly _user = signal<User | null>(null);
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Sinais públicos (somente leitura)
  public readonly user = this._user.asReadonly();
  public readonly isAuthenticated = this._isAuthenticated.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly error = this._error.asReadonly();

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
      // Decodifica o token usando uma tipagem forte para mais segurança
      const decodedToken: JwtPayload & User = jwtDecode(token);

      const user: User = {
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email,
      };

      this._user.set(user);
      this._isAuthenticated.set(true);
    }
    this._isLoading.set(false);
  }

  /**
   * Verifica a existência de um token de autenticação no armazenamento local ao iniciar a aplicação.
   * Se um token for encontrado, valida a sessão.
   */
  public async checkAuth(): Promise<void> {
    this._isLoading.set(true);
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.handleNewToken(token);
    } else {
      this._isLoading.set(false);
    }
  }

  /**
   * Tenta autenticar o usuário com as credenciais fornecidas.
   * @param credentials O email e a senha do usuário.
   */
  public async login(credentials: LoginRequest): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const response = await lastValueFrom(
        this.http.post<AuthResponse>(
          `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.LOGIN}`,
          credentials
        )
      );

      if (response?.result?.token) {
        this.handleNewToken(response.result.token);
        // O isLoading é definido como false dentro de handleNewToken,
        // então não precisamos definir aqui antes de navegar.
        this.router.navigate(['/dashboard']);
      } else {
        throw new Error('Token não recebido do servidor.');
      }
    } catch (error: any) {
      const errorMessage = error?.error?.message || 'E-mail ou senha inválidos.';
      this._error.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this._isLoading.set(false); // Garante que o loading termine, independentemente do resultado.
    }
  }

  /**
   * Registra um novo usuário.
   * @param userData Os dados para o registro do novo usuário.
   */
  public async register(userData: RegisterRequest): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      // A API de registro não retorna um token, então apenas esperamos a conclusão.
      await lastValueFrom(
        this.http.post<void>(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.REGISTER}`, userData)
      );
      // Não faz nada com a resposta, apenas conclui com sucesso
      this._isLoading.set(false);
    } catch (error: any) {
      const errorMessage = error?.error?.message || 'Erro ao tentar registrar.';
      this._error.set(errorMessage);
      this._isLoading.set(false);
      throw new Error(errorMessage);
    }
  }

  /**
   * Desconecta o usuário, limpando os dados da sessão e redirecionando para a página de login.
   */
  public logout(): void {
    localStorage.removeItem('auth_token');
    this._user.set(null);
    this._isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Verifica de forma síncrona se o usuário está autenticado.
   * Ideal para uso em guards.
   * @returns `true` se o usuário estiver autenticado, caso contrário `false`.
   */
  public isAuthenticatedCheck(): boolean {
    return this._isAuthenticated();
  }
}
