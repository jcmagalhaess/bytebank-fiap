export type TransactionType = 'deposit' | 'transfer';
export type TransactionName = 'Depósito' | 'Transferência';

export const TransactionTypeNameMap: Record<TransactionType, TransactionName> = {
  deposit: 'Depósito',
  transfer: 'Transferência',
};

export class Transaction {
  constructor(
    public id: number,
    public type: TransactionType,
    public amount: number,
    public date: string,
  ) {}
}