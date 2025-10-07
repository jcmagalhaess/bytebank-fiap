import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { AuthService, IUserSummary, IUserYearlySummary } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _http = inject(HttpClient);
  private _authService = inject(AuthService);

  public summary = signal<IUserSummary | null>(null);

  public yearlySummary = signal<IUserYearlySummary[] | null>(null);

  // Sinal computado para obter apenas o nome do usuário
  public userName = computed(() => this._authService.account()?.nome);
  public monthLabels = signal(
    Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')
    )
  );

  // Sinal computado com os dados de transações agrupados por mês para o gráfico
  public monthlyChartData = computed(() => {
    const summaryData = this.yearlySummary();
    const labels = this.monthLabels();
    const incomeData = new Array(12).fill(0);
    const expenseData = new Array(12).fill(0);

    if (summaryData) {
      summaryData.forEach((item) => {
        // Converte o nome do mês (ex: "Janeiro") para o formato curto (ex: "jan.") para encontrar o índice
        const shortMonth = item.month.substring(0, 3).toLowerCase();
        const index = labels.findIndex((label) => label.toLowerCase() === shortMonth.toLowerCase());

        if (index !== -1) {
          incomeData[index] = item.credit;
          // A API retorna o débito como negativo, então usamos Math.abs para o gráfico
          expenseData[index] = Math.abs(item.debit);
        }
      });
    }

    return {
      labels: labels,
      title: 'Análise Mensal', // Adicionando o título aqui
      datasets: [
        {
          label: 'Receitas',
          data: incomeData,
          backgroundColor: '#00AAFF', // Azul para receitas
          borderRadius: 15, // Deixa a barra totalmente arredondada
        },
        {
          label: 'Despesas',
          data: expenseData,
          backgroundColor: '#0F2C59', // Azul escuro para despesas
          borderRadius: 15, // Deixa a barra totalmente arredondada
        },
      ],
    };
  });

  public async getSummary(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this._http.get<IUserSummary>(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.SUMMARY}`)
      );

      this.summary.set(response);
    } catch (error) {
      console.error('Erro ao buscar resumo:', error);
      this.summary.set(null);
    }
  }

  public async getYearlySummary(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this._http.get<IUserYearlySummary[]>(
          `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.YEARLY_SUMMARY}`
        )
      );

      this.yearlySummary.set(response);
    } catch (error) {
      console.error('Erro ao buscar resumo:', error);
      this.yearlySummary.set(null);
    }
  }
}
