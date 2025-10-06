import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { lastValueFrom } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
}

export interface IUser {
  id: string;
  nome: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserSummary {
  credit: number;
  debit: number;
  total: number;
}

export type IUserYearlySummary = Omit<IUserSummary, 'total'> & {
  month: string;
};

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
  // Sinal para armazenar os dados da conta
  public account = signal<IUser | null>(null);
  // AccountService será injetado depois para evitar dependência cíclica no construtor

  // Sinais privados para controle interno do estado
  private readonly _user = signal<IUser | null>(null);
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
      const decodedToken: IUser = jwtDecode(token);
      this._user.set(decodedToken);
      localStorage.setItem('auth_token', token);
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
      await this.getAccountData();
    } else {
      // Se não houver token, apenas definimos isLoading como false.
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

      if (response.token) {
        this.handleNewToken(response.token);
        await this.getAccountData();
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

  /**
   * Busca os dados da conta (conta, transações, cartões) do usuário logado na API.
   */
  public async getAccountData(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.http.get<IUser>(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.ACCOUNT}`)
      );
      console.log('👤 Conta do usuário:', response);

      this.account.set(response);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      this.account.set(null);
    }
  }
}
