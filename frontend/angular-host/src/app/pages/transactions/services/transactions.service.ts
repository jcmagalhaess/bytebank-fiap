import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import { AccountService } from '../../../core/services/account.service';
import { removeNullProperties } from '../../../shared/utils/remove-null-properties';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly _http = inject(HttpClient);
  private readonly _accountService = inject(AccountService);

  public transactionList = signal<any>(null);
  public loading = signal<boolean>(false);
  public loadingCreate = signal<boolean>(false);
  public loadingUpdate = signal<boolean>(false);
  public loadingDelete = signal<boolean>(false);

  public async insert(transaction: any): Promise<void> {
    this.loadingCreate.set(true);
    try {
      await lastValueFrom(
        this._http.post(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.TRANSACTIONS}`, transaction)
      ).finally(() => {
        this.loadingCreate.set(false);
      });

      await this.updateSystemData();
    } catch (error) {
      console.error('Erro ao inserir transação:', error);
      throw error;
    }
  }

  public async update(id: number, transaction: any): Promise<void> {
    this.loadingUpdate.set(true);
    try {
      await lastValueFrom(
        this._http.patch(
          `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`,
          transaction
        )
      ).finally(() => {
        this.loadingUpdate.set(false);
      });

      await this.updateSystemData();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  }

  public async list(paramsObj: any = { }): Promise<any[]> {
    const urlParams = new URLSearchParams(removeNullProperties(paramsObj));
    const queryString = urlParams.toString();

    this.loading.set(true);
    try {
      const response = await lastValueFrom(
        this._http.get<any[]>(
          `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.TRANSACTIONS}?${queryString}`
        )
      ).finally(() => {
        this.loading.set(false);
      });
      console.log('✅ Transações carregadas:', response);
      this.transactionList.set(response);

      return response;
    } catch (error) {
      console.error('Erro ao listar transações:', error);
      throw error;
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      await lastValueFrom(
        this._http.delete(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`)
      ).finally(() => {
        this.loadingDelete.set(false);
      });

      await this.updateSystemData();
    } catch (error) {
      console.error('Erro ao deletar transações:', error);
      throw error;
    }
  }

  public async updateSystemData() {
    await this.list();
    await this._accountService.getSummary();
    await this._accountService.getYearlySummary();
  }
}
