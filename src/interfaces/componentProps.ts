import { Transaction, TransactionType } from "../app/models/transaction";

export interface StatementProps {
  transactions: Transaction[];
  limit?: number;
  onRefresh: () => void;
}

export interface NewTransactionFormProps {
  onAdd: (newTransaction: { type: string; amount: number; date: string }) => Promise<void>;
}

export interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: {
    id: number;
    type: TransactionType;
    amount: number;
  } | null;
  onSave: (updatedTransaction: {
    id: number;
    type: TransactionType;
    amount: number;
  }) => void;
  onClose: () => void;
}
