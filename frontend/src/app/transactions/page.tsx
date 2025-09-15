"use client";

import { PageContainer } from '@/components/pageContainer';
import { EditTransactionModal } from '@/components/transaction/EditTransactionModal';
import { TransactionRow } from '@/components/transaction/transactionRow';
import { TransactionFilters } from '@/components/TransactionFilters';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { SettingIcon } from '@/components/icons/settingIcon';
import { SearchIcon } from '@/components/icons/searchIcon';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
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
    id?: number;
    type: "deposit" | "transfer";
    amount: number;
    categoria?: string;
    descricao?: string;
    pdfUrl?: string;
    pdfFileName?: string;
  }) {
    if (updated.id) {
      // Modo editar
      TransactionService.update(updated.id, updated);
      setEditingTransaction(null);
    } else {
      // Modo adicionar
      await TransactionService.add({
        type: updated.type,
        amount: updated.amount,
        date: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        categoria: updated.categoria,
        descricao: updated.descricao,
        pdfUrl: updated.pdfUrl,
        pdfFileName: updated.pdfFileName,
      });
      setShowAddModal(false);
    }
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
    <main className="min-h-[80vh] bg-[#E6F0FA] w-full xl:justify-items-center mt-[-25px]">
      {/* Card superior com saldo */}
      <PageContainer
        variant="highlight"
        title="Extrato de Transações"
        subtitle={formatToBRL(balance)}
        />

        <div className="relative mt-[-4.5rem] z-10 w-[50%] mx-auto">
      {/* Lista de transações com TransactionRow */}
      <PageContainer 
        variant="sectioned" 
        className="max-w-full overflow-x-auto w-[100%]" 
        exibirExtratoLink={false} 
        exibirBotaoVoltar={true}
        customHeader={
          <div className="w-full">
            {/* Barra de busca e botões */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Barra de busca */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative w-[40%]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="text-textSecondary" />
                  </div>
                  <input
                    id="search-transactions-input"
                    type="text"
                    placeholder="Buscar transação..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 border border-backgroundSecondary rounded-lg bg-white text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-brandPrimary focus:border-transparent"
                  />
                  {/* Botão X para limpar busca - só aparece quando há texto */}
                  {filters.search && (
                    <button
                      type="button"
                      onClick={() => updateFilters({ ...filters, search: '' })}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-textSecondary hover:text-textPrimary transition-colors duration-200 z-10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Botão de Filtros */}
              <div className="flex items-center gap-3">
                <Button variant="tertiary"
                  id="filters-toggle-button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-100 text-gray-700 rounded-lg shadow-sm hover:bg-blue-200 transition-colors duration-200 h-9"
                >
                  <SettingIcon className="text-[#0F2C59]" />
                  Filtro
                </Button>

                {/* Botão Adicionar Transação */}
                <Button
                  id="add-transaction-button"
                  variant="primary"
                  onClick={() => setShowAddModal(true)}
                >
                  Adicionar Transação
                </Button>
              </div>
            </div>

            {/* Componente de Filtros */}
            {showFilters && (
              <div className="mt-4">
                <TransactionFilters
                  filters={filters}
                  onFiltersChange={updateFilters}
                  onClearFilters={clearFilters}
                  availableCategories={availableCategories}
                  isDropdown={true}
                />
              </div>
            )}
          </div>
        }
        pagination={
          !loading && Array.isArray(transactions) && transactions.length > 0 && filteredTransactions.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredTransactions.length}
            />
          ) : null
        }
      >
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
                  date={t.date.includes('T') ? t.date.split('T')[0].split("-").reverse().join("/") : t.date.split("-").reverse().join("/")}
                  categoria={t.categoria}
                  descricao={t.descricao}
                  amount={formatToBRL(t.amount)}
                  onEdit={() => setEditingTransaction(t)}
                  onDelete={() => setDeleteId(t.id)}
                  pdfUrl={t.pdfUrl}
                  pdfFileName={t.pdfFileName}
                  onPdfDelete={() => {
                    TransactionService.deletePdf(t.id);
                    fetchTransactions(); // Recarrega as transações para atualizar a UI
                  }}
                />
              ))}
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
          descricao: editingTransaction.descricao,
          pdfUrl: editingTransaction.pdfUrl,
          pdfFileName: editingTransaction.pdfFileName,
        } : null}
        onClose={() => setEditingTransaction(null)}
        onSave={handleSave}
        mode="edit"
      />

      {/* Modal de Adicionar Transação */}
      <EditTransactionModal
        isOpen={showAddModal}
        transaction={null}
        onClose={() => setShowAddModal(false)}
        onSave={handleSave}
        mode="add"
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
      </div>
    </main>
  );
}