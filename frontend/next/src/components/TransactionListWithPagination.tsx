'use client';

import { useState } from 'react';
import { TransactionRow } from './transaction/transactionRow';
import { Pagination } from './ui/pagination';
import { formatToBRL } from '@/utils/format';
import type { Transaction } from '../app/models/transaction';

interface TransactionListWithPaginationProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  itemsPerPage?: number;
}

export function TransactionListWithPagination({
  transactions,
  onEdit,
  onDelete,
  itemsPerPage = 10
}: TransactionListWithPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (transactions.length === 0) {
    return (
      <p className="text-gray-400 text-center py-8">
        Nenhuma transação encontrada.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Lista de transações */}
      <div className="space-y-2">
        {currentTransactions
          .slice()
          .reverse()
          .map((transaction) => (
            <TransactionRow
              key={transaction.id}
              type={transaction.type}
              date={transaction.date.split("-").reverse().join("/")}
              categoria={transaction.categoria}
              amount={formatToBRL(transaction.amount)}
              onEdit={() => onEdit(transaction)}
              onDelete={() => onDelete(transaction.id)}
            />
          ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={transactions.length}
        />
      )}
    </div>
  );
}
