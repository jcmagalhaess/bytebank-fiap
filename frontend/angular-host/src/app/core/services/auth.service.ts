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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _router = inject(Router);
  private _http = inject(HttpClient);

  user = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

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

  public async checkAuth(): Promise<void> {
    this.isLoading.set(true);
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Aqui você poderia adicionar uma chamada à API para validar o token no backend
      // Por enquanto, apenas decodificamos e confiamos que ele existe.
      this.handleNewToken(token);
    } else {
      this.isLoading.set(false);
    }
  }

  public async loginWithCredentials(credentials: LoginRequest): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    console.log('aqui');

    try {
      const response = await lastValueFrom(
        this._http.post<AuthResponse>(
          `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.LOGIN}`,
          credentials
        )
      );

      if (response && response.result && response.result.token) {
        console.log(response.result.token);

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

  public logout() {
    this.handleLogout();
  }

  private handleLogout() {
    localStorage.clear();
    this.user.set(null);
    this.isAuthenticated.set(false);
    this._router.navigate(['/login']);
  }

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
