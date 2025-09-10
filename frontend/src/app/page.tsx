"use client";

import { PageContainer } from '@/components/pageContainer';
import { DynamicCards } from '@/components/dynamicCards';
import { useEffect, useState } from 'react';
import NewTransactionForm from '../components/NewTransactionForm';
import Statement from '../components/Statement';
import { useAuthContext } from '../contexts/AuthContext';
import type { Transaction } from './models/transaction';
import { TransactionService } from './services/transactionService';

export default function HomePage() {
  const { user, isAuthenticated } = useAuthContext();
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

  const balance = Array.isArray(transactions) ? transactions.reduce((acc, t) => {
    if (t.type === 'deposit') return acc + t.amount;
    if (t.type === 'transfer') return acc - t.amount;
    return acc;
  }, 0) : 0;

  async function handleAddTransaction(transaction: Omit<Transaction, 'id'>) {
    setLoading(true);
    await TransactionService.add(transaction);
    await refreshTransactions();
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }

  return (
    <>
      {/* Container principal com posicionamento relativo */}
      <div className="relative">
        {/* Card superior com saldo */}
        <PageContainer
          variant="highlight"
          title={isAuthenticated && user ? `Olá, ${user.username}` : "Olá, Visitante"}
          subtitle={loading ? "Carregando..." : currencyFormatter.format(balance)}
        />
        
        {/* Div geral que engloba todos os elementos */}
        <div className="relative">
          {/* Cards dinâmicos sobrepostos ao fundo azul */}
          <div className="relative mt-[-4.5rem] z-10">
            <div className="flex gap-6 w-[50%] mx-auto">
            {/* Card de Análise Financeira - 55% da largura */}
            <div className="w-[55%] bg-backgroundPrimary rounded-xl shadow-md p-6 h-[330px] flex flex-col">
              <h3 className="text-h5 font-semibold text-textPrimary mb-md">Análise Financeira</h3>
              {/* Espaço para o gráfico futuro */}
              <div className="flex-1 flex items-center justify-center text-textSecondary">
                Gráfico será implementado aqui
              </div>
            </div>
              
              {/* Cards de despesas, receitas e total - 45% da largura */}
              <div className="w-[45%]">
                {!loading && <DynamicCards transactions={transactions} />}
              </div>
            </div>
          </div>

          {/* Main content com fundo azul claro */}
          <main className="min-h-[80vh] bg-[#E6F0FA] p-6 w-full pt-10">
            {/* Grid com extrato + nova transação */}
            <section className="flex justify-center w-[51%] mx-auto">
              <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-6 items-start">
                {!loading && <NewTransactionForm onAdd={handleAddTransaction} />}
                {!loading && <Statement transactions={transactions} onRefresh={refreshTransactions}/>}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* 🔔 Notificação visível sempre que ativa */}
      {showNotification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          Transação concluída com sucesso!
        </div>
      )}
    </>
  );
}