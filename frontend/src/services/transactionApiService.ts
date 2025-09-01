import { ApiService } from './api';
import { API_CONFIG } from '../config/api';
import { Transaction, TransactionType } from '../app/models/transaction';

export interface CreateTransactionRequest {
  accountId: string;
  value: number;
  type: string; // "Debit" ou "Credit" baseado no Postman
}

export interface TransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  date: string;
  categoria?: string;
}

export class TransactionApiService {
  static async getTransactions(accountId: string): Promise<Transaction[]> {
    try {
      const response = await ApiService.get<TransactionResponse[]>(
        API_CONFIG.ENDPOINTS.STATEMENT(accountId)
      );
      
      return response.result?.map(t => new Transaction(
        t.id,
        t.type,
        t.amount,
        t.date,
        t.categoria
      )) || [];
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  }

  static async createTransaction(transactionData: CreateTransactionRequest): Promise<any> {
    try {
      const response = await ApiService.post<any>(
        API_CONFIG.ENDPOINTS.TRANSACTION,
        transactionData
      );

      return response.result || response;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  }

  static async getAccounts(): Promise<any[]> {
    try {
      const response = await ApiService.get<any[]>(API_CONFIG.ENDPOINTS.ACCOUNT);
      return response.result || [];
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      throw error;
    }
  }
}
