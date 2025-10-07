import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import { AccountService } from '../../../core/services/account.service';
import { Confirmable } from '../../../shared/decorators/confirmable/confirmable.decorator';
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
  public loadingPreview = signal<boolean>(false);

  public async insert(transaction: FormData): Promise<void> {
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

  public async update(id: number, transaction: FormData): Promise<void> {
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

  public async list(paramsObj: any = {}): Promise<any[]> {
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

  @Confirmable('Tem certeza que deseja excluir essa transação?', 'Confirmar exclusão')
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

  public async getReceiptDetails(id: number): Promise<{ url: string; name: string; size: number }> {
    this.loadingPreview.set(true);

    try {
      const response = await lastValueFrom(
        this._http.get<{ url: string; name: string; size: number }>(
          `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}/receipt`
        )
      ).finally(() => {
        this.loadingPreview.set(false);
      });
      return response;
    } catch (error) {
      console.error('Erro ao buscar detalhes do recibo:', error);
      throw error;
    }
  }

  public getReceiptDownloadUrl(id: number): string {
    // Retorna a URL direta para o endpoint de download, o backend cuidará do redirecionamento.
    return `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}/receipt/download`;
  }

  public async updateSystemData() {
    await this.list();
    await this._accountService.getSummary();
    await this._accountService.getYearlySummary();
  }
}
