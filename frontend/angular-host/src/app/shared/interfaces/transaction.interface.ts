export interface Transaction {
  id: number;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  categoria: string;
  descricao: string;
  pdfUrl?: string;
  pdfFileName?: string;
}

export interface TransactionFilters {
  type: 'all' | 'credit' | 'debit';
  startDate: string;
  endDate: string;
  category: string;
  minValue: string;
  maxValue: string;
  search: string;
}

export interface TransactionFormData {
  id?: number;
  type: 'credit' | 'debit';
  amount: number;
  categoria: string;
  descricao: string;
  pdfUrl?: string;
  pdfFileName?: string;
}

export type ITransactionType = 'credit' | 'debit';

export type ITransactionRequest = {
  tipoTransacao: ITransactionType;
  valor: number;
  descricao: string;
  categoria: string;
  comprovante?: File;
};
