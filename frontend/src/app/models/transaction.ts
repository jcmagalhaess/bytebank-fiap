export type TransactionType = 'deposit' | 'transfer';
export type TransactionName = 'Receita' | 'Despesa';

export const TransactionTypeNameMap: Record<TransactionType, TransactionName> = {
  deposit: 'Receita',
  transfer: 'Despesa',
};

export class Transaction {
  constructor(
    public id: number,
    public type: TransactionType,
    public amount: number,
    public date: string,
    public categoria?: string,
    public descricao?: string,
    public pdfUrl?: string,
    public pdfFileName?: string
  ) {}
}