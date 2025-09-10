"use client";

import { PageContainer } from '@/components/pageContainer';
import { EditTransactionModal } from '@/components/transaction/EditTransactionModal';
import { TransactionRow } from '@/components/transaction/transactionRow';
import { TransactionFilters } from '@/components/TransactionFilters';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { formatToBRL } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTransactionFilters } from '../../hooks/useTransactionFilters';
import type { Transaction } from '../models/transaction';
import { TransactionService } from '../services/transactionService';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const ITEMS_PER_PAGE = 10;

  // Hook de filtros
  const {
    filters,
    filteredTransactions,
    availableCategories,
    updateFilters,
    clearFilters,
    hasActiveFilters
  } = useTransactionFilters(transactions);

  async function fetchTransactions() {
    setLoading(true);
    const list = await TransactionService.list();
    setTransactions(list);
    setLoading(false);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Reset página quando transações ou filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions.length, filteredTransactions.length]);

  async function handleDelete(id: number) {
    TransactionService.delete(id);
    setDeleteId(null);
    fetchTransactions();
  }

  async function handleSave(updated: {
    id: number;
    type: "deposit" | "transfer";
    amount: number;
  }) {
    TransactionService.update(updated.id, updated);
    setEditingTransaction(null);
    fetchTransactions();
  }

  // Cálculo do saldo total (todas as transações, não filtradas)
  const balance = Array.isArray(transactions) ? transactions.reduce((acc, t) => {
    if (t.type === "deposit") return acc + t.amount;
    if (t.type === "transfer") return acc - t.amount;
    return acc;
  }, 0) : 0;

  // Lógica de paginação usando transações filtradas
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll para o topo da lista
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-[80vh] bg-[#E6F0FA] p-6 w-full xl:justify-items-center">
      {/* Card superior com saldo */}
      <PageContainer
        variant="highlight"
        title="Transações e Depósitos"
        subtitle={formatToBRL(balance)}
      />

      {/* Componente de Filtros */}
      <TransactionFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        availableCategories={availableCategories}
      />

      {/* Lista de transações com TransactionRow */}
      <PageContainer variant="sectioned" className="bg-white rounded-xl shadow-md p-6 max-w-full overflow-x-auto w-[100%]" exibirExtratoLink={false} exibirBotaoVoltar={true}>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Carregando transações...</div>
          </div>
        ) : !Array.isArray(transactions) || transactions.length === 0 ? (
          <p className="text-gray-400">Nenhuma transação encontrada.</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-gray-400">Nenhuma transação encontrada com os filtros aplicados.</p>
        ) : (
          <>
            {/* Indicador de resultados filtrados */}
            {hasActiveFilters() && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Mostrando {filteredTransactions.length} de {transactions.length} transações
                  {filteredTransactions.length !== transactions.length && ' (filtradas)'}
                </p>
              </div>
            )}

            {/* Transações da página atual */}
            {currentTransactions
              .slice()
              .reverse()
              .map((t) => (
                <TransactionRow
                  key={t.id}
                  type={t.type}
                  date={t.date.split("-").reverse().join("/")}
                  categoria={t.categoria}
                  descricao={t.descricao}
                  showCategoria={true}
                  amount={formatToBRL(t.amount)}
                  onEdit={() => setEditingTransaction(t)}
                  onDelete={() => setDeleteId(t.id)}
                />
              ))}
            
            {/* Componente de paginação */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredTransactions.length}
            />
          </>
        )}
      </PageContainer>

      <EditTransactionModal
        isOpen={!!editingTransaction}
        transaction={editingTransaction ? {
          id: editingTransaction.id,
          type: editingTransaction.type,
          amount: editingTransaction.amount,
          categoria: editingTransaction.categoria,
        } : null}
        onClose={() => setEditingTransaction(null)}
        onSave={handleSave}
      />

      {/* Modal de confirmação de exclusão */}
      {deleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4 text-[#0A2A4D]">
              Confirmar exclusão
            </h3>
            <p className="mb-6">
              Tem certeza que deseja excluir esta transação?
            </p>
            <div className="w-full flex justify-center">
              <div className="flex justify-center gap-4 w-[60%]">
                <Button variant="primary" onClick={() => setDeleteId(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (deleteId !== null) handleDelete(deleteId);
                  }}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}