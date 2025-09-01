import { Transaction } from "../models/transaction";
import { TransactionApiService } from "../../services/transactionApiService";

const STORAGE_KEY = "transactions";

export class TransactionService {
  // Fallback para localStorage quando API não estiver disponível
  static loadTransactions(): Transaction[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  }

  static saveTransactions(transactions: Transaction[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }

  // Método principal que tenta usar API primeiro, fallback para localStorage
  static async list(accountId?: string): Promise<Transaction[]> {
    try {
      if (accountId) {
        return await TransactionApiService.getTransactions(accountId);
      }
      // Se não tiver accountId, usa localStorage como fallback
      return this.loadTransactions();
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
      const newTransaction = await TransactionApiService.createTransaction({
        accountId: accountId,
        value: t.amount,
        type: t.type === 'deposit' ? 'Credit' : 'Debit'
      });
      
      // Atualiza localStorage como backup
      const transactions = this.loadTransactions();
      const localTransaction = new Transaction(
        Date.now(),
        t.type,
        t.amount,
        t.date,
        t.categoria
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
        t.categoria
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
}
