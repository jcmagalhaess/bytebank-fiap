export interface Transaction {
  id: number;
  type: 'deposit' | 'transfer';
  amount: number;
  date: string;
  categoria: string;
  descricao: string;
  pdfUrl?: string;
  pdfFileName?: string;
}

export interface TransactionFilters {
  type: 'all' | 'deposit' | 'transfer';
  startDate: string;
  endDate: string;
  category: string;
  minValue: string;
  maxValue: string;
  search: string;
}

export interface TransactionFormData {
  id?: number;
  type: 'deposit' | 'transfer';
  amount: number;
  categoria: string;
  descricao: string;
  pdfUrl?: string;
  pdfFileName?: string;
}


