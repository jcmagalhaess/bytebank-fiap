export type IResponse<T> = {
  message: string;
  result: T;
};

export type IUserAccount = {
  account: IAccount[];
  transactions: ITransaction[];
  cards: ICard[];
};

export type ICard = {
  id: string;
  accountId: string;
  type: ITransactionType;
  is_blocked: false;
  number: string;
  dueDate: string;
  functions: ITransactionType;
  cvc: string;
  paymentDate: null;
  name: string;
};

export type ITransaction = {
  id: string;
  accountId: string;
  type: ITransactionType;
  value: 2000;
  date: string;
};

export type IAccount = {
  id: string;
  type: ITransactionType;
  userId: string;
};

export type ITransactionType = 'Credit' | 'Debit';
