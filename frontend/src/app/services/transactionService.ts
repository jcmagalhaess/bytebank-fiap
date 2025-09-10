import { Transaction } from "../models/transaction";
import { TransactionApiService } from "../../services/transactionApiService";

export class TransactionService {
  // Chave do localStorage baseada no usuário logado
  private static getStorageKey(): string {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return `transactions_${payload.id}`;
      }
    } catch (error) {
      console.warn('Erro ao decodificar token:', error);
    }
    // Fallback para chave genérica se não conseguir obter o ID
    return "transactions_anonymous";
  }

  // Fallback para localStorage quando API não estiver disponível
  static loadTransactions(): Transaction[] {
    const storageKey = this.getStorageKey();
    const data = localStorage.getItem(storageKey);
    if (!data) return [];
    return JSON.parse(data);
  }

  static saveTransactions(transactions: Transaction[]) {
    const storageKey = this.getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(transactions));
  }

  // Método principal que SEMPRE prioriza localStorage
  static async list(): Promise<Transaction[]> {
    try {
      // Carrega transações locais PRIMEIRO
      const localTransactions = this.loadTransactions();
      
      // SE JÁ TEM TRANSAÇÕES LOCAIS, RETORNA ELAS SEMPRE
      if (localTransactions.length > 0) {
        return localTransactions;
      }
      
      // SÓ BUSCA DA API SE NÃO TEM NADA LOCAL E NUNCA FOI SINCRONIZADO
      const syncKey = this.getSyncFlagKey();
      if (!localStorage.getItem(syncKey)) {
        
        // Busca conta do usuário
        const accounts = await this.getAccounts();
        if (accounts.length === 0) {
          console.warn('Nenhuma conta encontrada para o usuário');
          return [];
        }
        
        const accountId = accounts[0]._id || accounts[0].id;
        if (!accountId) {
          console.warn('ID da conta não encontrado');
          return [];
        }
        
        // Busca da API UMA ÚNICA VEZ
        const apiTransactions = await TransactionApiService.getTransactions(accountId);
        
        
        // Mapeia e salva
        const mappedTransactions = this.mapApiTransactionsToLocal(apiTransactions);
        this.saveTransactions(mappedTransactions);
        
        // MARCA COMO SINCRONIZADO PARA SEMPRE
        localStorage.setItem(syncKey, 'true');
        
        return mappedTransactions;
      }
      
      // Se chegou aqui, não tem transações locais mas já foi sincronizado
      // Isso significa que o usuário excluiu tudo - retorna array vazio
      return [];
      
    } catch (error) {
      console.warn('Erro ao buscar transações da API, usando localStorage:', error);
      return this.loadTransactions();
    }
  }

  static get(id: number): Transaction | undefined {
    return this.loadTransactions().find(t => t.id === id);
  }

  static async add(t: Omit<Transaction, "id">): Promise<Transaction> {
    try {
      // Primeiro, obtém uma conta para usar
      const accounts = await this.getAccounts();
      if (accounts.length === 0) {
        throw new Error('Nenhuma conta encontrada');
      }
      
      const accountId = accounts[0]._id || accounts[0].id;
      
      // Tenta criar via API primeiro
      const apiType = t.type === 'deposit' ? 'Credit' : 'Debit';
      const newTransaction = await TransactionApiService.createTransaction({
        accountId: accountId,
        value: t.amount,
        type: apiType
      });
      
      // Atualiza localStorage como backup
      const transactions = this.loadTransactions();
      const localTransaction = new Transaction(
        Date.now(),
        t.type,
        t.amount,
        t.date,
        t.categoria,
        t.descricao
      );
      transactions.push(localTransaction);
      this.saveTransactions(transactions);
      
      return localTransaction;
    } catch (error) {
      console.warn('Erro ao criar transação via API, usando localStorage:', error);
      
      // Fallback para localStorage
      const transactions = this.loadTransactions();
      const newTransaction = new Transaction(
        Date.now(),
        t.type,
        t.amount,
        t.date,
        t.categoria,
        t.descricao
      );
      transactions.push(newTransaction);
      this.saveTransactions(transactions);
      return newTransaction;
    }
  }

  static update(id: number, data: Partial<Transaction>): Transaction | undefined {
    const transactions = this.loadTransactions();
    const idx = transactions.findIndex(t => t.id === id);
    if (idx > -1) transactions[idx] = { ...transactions[idx], ...data };
    this.saveTransactions(transactions);
    return transactions[idx];
  }

  static delete(id: number): void {
    let transactions = this.loadTransactions();
    transactions = transactions.filter(t => t.id !== id);
    this.saveTransactions(transactions);
  }

  // Método para obter contas do usuário
  static async getAccounts() {
    try {
      return await TransactionApiService.getAccounts();
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      return [];
    }
  }

  // Chave para controlar se já foi feita a sincronização inicial
  private static getSyncFlagKey(): string {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return `sync_completed_${payload.id}`;
      }
    } catch (error) {
      console.warn('Erro ao decodificar token:', error);
    }
    return "sync_completed_anonymous";
  }

  // Método para mapear transações da API para o formato local
  private static mapApiTransactionsToLocal(apiTransactions: any[]): Transaction[] {
    return apiTransactions.map((t: any) => {
      // Preserva o tipo original se existir, senão converte da API
      let transactionType: 'deposit' | 'transfer';
      if (t.type === 'deposit' || t.type === 'transfer') {
        // Já está no formato correto
        transactionType = t.type;
      } else if (t.type === 'Credit') {
        transactionType = 'deposit';
      } else if (t.type === 'Debit') {
        transactionType = 'transfer';
      } else {
        // Fallback para transfer se não conseguir determinar
        transactionType = 'transfer';
        console.warn('Tipo de transação não reconhecido, usando fallback:', t.type);
      }
      
      const transaction = new Transaction(
        t.id || t._id || `api_${Date.now()}_${Math.random()}`, // ID único para transações da API
        transactionType,
        Number(t.value) || Number(t.amount) || 0,
        t.date || new Date().toISOString(),
        t.from || t.to || t.categoria || 'Geral',
        t.descricao || t.anexo || 'Transação'
      );
      
      return transaction;
    });
  }
}
