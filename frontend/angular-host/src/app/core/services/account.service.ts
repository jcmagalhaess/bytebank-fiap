import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IResponse, IUserAccount } from '../../shared/interfaces/global.interface';
import { API_CONFIG } from '../config/api.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _http = inject(HttpClient);
  private _authService = inject(AuthService);

  // Sinal para armazenar os dados da conta
  public account = signal<IUserAccount | null>(null);

  // Sinal computado para obter apenas o nome do usuário
  public userName = computed(() => this._authService.user()?.username);

  // Sinal computado para obter apenas as transações do usuário
  public userTransactions = computed(() => this.account()?.transactions ?? []);

  // Sinal computado para obter apenas os valores de crédito do usuário
  public userCredits = computed(() =>
    this.userTransactions()
      ?.filter((transaction) => transaction.type === 'Credit')
      .reduce((total, transaction) => total + transaction.value, 0)
  );

  // Sinal computado para obter apenas os valores de débito do usuário
  public userDebits = computed(() =>
    this.userTransactions()
      ?.filter((transaction) => transaction.type === 'Debit')
      .reduce((total, transaction) => total + transaction.value, 0)
  );

  // Sinal computado para obter o saldo atual do usuário
  public userBalance = computed(() => this.userCredits() + this.userDebits());

  /**
   * Retorna os dados básicos do usuário logado.
   */
  public getUser() {
    return this._authService.user();
  }

  /**
   * Busca os dados da conta (conta, transações, cartões) do usuário logado na API.
   */
  public async getAccountData(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this._http.get<IResponse<IUserAccount>>(
          `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.ACCOUNT}`
        )
      );
      this.account.set(response.result);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      this.account.set(null);
    }
  }
}
