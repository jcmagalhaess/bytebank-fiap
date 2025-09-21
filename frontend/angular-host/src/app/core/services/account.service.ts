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

  // Sinal computado com os dados de transações agrupados por mês para o gráfico
  public monthlyChartData = computed(() => {
    const transactions = this.userTransactions();
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    const monthLabels = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('pt-BR', { month: 'short' })
    );

    monthLabels.forEach((month) => (monthlyData[month] = { income: 0, expense: 0 }));

    transactions.forEach((transaction) => {
      const monthName = new Date(transaction.date).toLocaleString('pt-BR', { month: 'short' });
      if (transaction.type === 'Credit') {
        monthlyData[monthName].income += transaction.value;
      } else if (transaction.type === 'Debit') {
        monthlyData[monthName].expense += transaction.value;
      }
    });

    const incomeData = monthLabels.map((month) => monthlyData[month].income);
    const expenseData = monthLabels.map((month) => monthlyData[month].expense);

    return {
      labels: monthLabels,
      title: 'Análise Mensal', // Adicionando o título aqui
      datasets: [
        {
          label: 'Receitas',
          data: incomeData,
          backgroundColor: '#00AAFF',
          borderRadius: 15,
        },
        {
          label: 'Despesas',
          data: expenseData,
          backgroundColor: '#0F2C59',
          borderRadius: 15,
        },
      ],
    };
  });

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
