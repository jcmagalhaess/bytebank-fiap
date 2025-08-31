"use client";

import { PageContainer } from '@/components/pageContainer';
import { useEffect, useState } from 'react';
import NewTransactionForm from '../components/NewTransactionForm';
import Statement from '../components/Statement';
import type { Transaction } from './models/transaction';
import { TransactionService } from './services/transactionService';

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  async function refreshTransactions() {
    const data = await TransactionService.list();
    setTransactions(data);
    setLoading(false);
  }

  useEffect(() => {
    refreshTransactions();
  }, []);

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  const balance = transactions.reduce((acc, t) => {
    if (t.type === 'deposit') return acc + t.amount;
    if (t.type === 'transfer') return acc - t.amount;
    return acc;
  }, 0);

  async function handleAddTransaction(transaction: Omit<Transaction, 'id'>) {
    setLoading(true);
    await TransactionService.add(transaction);
    await refreshTransactions();
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }

  return (
    <main className="min-h-[80vh] bg-[#E6F0FA] p-6 w-full">
      {/* Card superior com saldo */}
      <PageContainer
        variant="highlight"
        title="Olá Joana"
        subtitle={loading ? "Carregando..." : currencyFormatter.format(balance)}
      />

      {/* Grid com extrato + nova transação */}
      <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] xl:gap-0 md:flex md:flex-col md:gap-0 lg:flex lg:flex-col xl:grid ">
        {!loading && <Statement transactions={transactions} onRefresh={refreshTransactions}/>}
        {!loading && <NewTransactionForm onAdd={handleAddTransaction} />}
      </section>

      {/* 🔔 Notificação visível sempre que ativa */}
      {showNotification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          Transação concluída com sucesso!
        </div>
      )}
    </main>
  );
}