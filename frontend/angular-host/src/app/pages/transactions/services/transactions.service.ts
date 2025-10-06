import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import { AccountService } from '../../../core/services/account.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly _http = inject(HttpClient);
  private readonly _accountService = inject(AccountService);

  public async insert(transaction: any): Promise<void> {
    try {
      await lastValueFrom(
        this._http.post(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.TRANSACTIONS}`, transaction)
      );

      await this.list();
      await this._accountService.getSummary();
      await this._accountService.getYearlySummary();
    } catch (error) {
      console.error('Erro ao inserir transação:', error);
      throw error;
    }
  }

  public async list(): Promise<any[]> {
    try {
      const response = await lastValueFrom(
        this._http.get<any[]>(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.TRANSACTIONS}`)
      );
      console.log('✅ Transações carregadas:', response);

      return response;
    } catch (error) {
      console.error('Erro ao listar transações:', error);
      throw error;
    }
  }
}
