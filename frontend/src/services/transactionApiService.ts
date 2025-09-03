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
      console.log('Buscando transações para accountId:', accountId);
      const response = await ApiService.get<any>(
        API_CONFIG.ENDPOINTS.STATEMENT(accountId)
      );
      
      console.log('Resposta da API getTransactions:', response);
      
      // Tenta diferentes estruturas de resposta
      let transactions = [];
      if (response.result?.transactions) {
        transactions = response.result.transactions;
      } else if (response.transactions) {
        transactions = response.transactions;
      } else if (response) {
        transactions = response;
      }
      
      console.log('Transações extraídas:', transactions);
      
      // Mapeia as transações para o formato correto
      return transactions.map((t: any) => {
        console.log('Mapeando transação original:', t);
        
        // Mapeia os campos da API para o modelo Transaction
        const transaction = new Transaction(
          t.id || t._id || Date.now(), // ID da transação
          t.type === 'Credit' ? 'deposit' : 'transfer', // Converte Credit -> deposit, Debit -> transfer
          Number(t.value) || Number(t.amount) || 0, // Valor da transação - converte para número
          t.date || new Date().toISOString(), // Data da transação
          t.from || t.to || t.categoria || 'Geral' // Categoria da transação
        );
        
        console.log('Transação mapeada:', transaction);
        console.log('Tipo da transação:', transaction.type);
        console.log('Valor da transação:', transaction.amount);
        console.log('Categoria da transação:', transaction.categoria);
        
        return transaction;
      });
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  }

  static async createTransaction(transactionData: CreateTransactionRequest): Promise<any> {
    try {
      console.log('Criando transação com dados:', transactionData);
      const response = await ApiService.post<any>(
        API_CONFIG.ENDPOINTS.TRANSACTION,
        transactionData
      );

      console.log('Resposta da criação da transação:', response);
      return response.result || response;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  }

  static async getAccounts(): Promise<any[]> {
    try {
      const response = await ApiService.get<any>(API_CONFIG.ENDPOINTS.ACCOUNT);
      console.log('Resposta da API getAccounts:', response);
      
      // Tenta diferentes estruturas de resposta
      if (response.result?.account) {
        return response.result.account;
      } else if (response.account) {
        return response.account;
      } else if (response) {
        return response;
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      return [];
    }
  }
}
