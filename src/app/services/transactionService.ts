import { Transaction } from "../models/transaction";

const STORAGE_KEY = "transactions";

export class TransactionService {
  static loadTransactions(): Transaction[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  }

  static saveTransactions(transactions: Transaction[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }

  static list(): Transaction[] {
    return this.loadTransactions();
  }

  static get(id: number): Transaction | undefined {
    return this.loadTransactions().find(t => t.id === id);
  }

  static add(t: Omit<Transaction, 'id'>): Transaction {
    const transactions = this.loadTransactions();
    const newTransaction = new Transaction(Date.now(), t.type, t.amount, t.date);
    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
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
}
