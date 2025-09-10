"use client";

import { Transaction } from "@/app/models/transaction";
import { formatToBRL } from "@/utils/format";

interface DynamicCardsProps {
  transactions: Transaction[];
}

export function DynamicCards({ transactions }: DynamicCardsProps) {
  // Calcular receitas (deposits)
  const receitas = transactions
    .filter(t => t.type === 'deposit')
    .reduce((acc, t) => acc + t.amount, 0);

  // Calcular despesas (transfers)
  const despesas = transactions
    .filter(t => t.type === 'transfer')
    .reduce((acc, t) => acc + t.amount, 0);

  // Calcular saldo atual
  const saldoAtual = receitas - despesas;

  // Calcular percentual de crescimento (simulado)
  const crescimentoReceitas = 5.2;
  const crescimentoDespesas = 2.0;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Linha superior - Receitas e Despesas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[150px]">
        {/* Card Receitas */}
        <div className="bg-backgroundPrimary rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-feedbackSuccess/10 rounded-lg flex items-center justify-center">
                <img src="/images/money-recive.png" alt="Receitas" className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-medium text-textSecondary">Receitas</h3>
            </div>
            <button className="text-textSecondary hover:text-textPrimary">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-h4 font-bold text-textPrimary">{formatToBRL(receitas)}</p>
            <p className="text-sm text-feedbackSuccess font-semibold">{crescimentoReceitas}%↑</p>
          </div>
        </div>

        {/* Card Despesas */}
        <div className="bg-backgroundPrimary rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-feedbackDanger/10 rounded-lg flex items-center justify-center">
                <img src="/images/money-send.png" alt="Despesas" className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-medium text-textSecondary">Despesas</h3>
            </div>
            <button className="text-textSecondary hover:text-textPrimary">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-h4 font-bold text-textPrimary">{formatToBRL(despesas)}</p>
            <p className="text-sm text-feedbackSuccess font-semibold">{crescimentoDespesas}%↑</p>
          </div>
        </div>
      </div>

      {/* Card Saldo Atual - Alinhado com os cards de cima */}
      <div className="bg-backgroundPrimary rounded-xl shadow-md p-6 content-center h-[150px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brandPrimary/10 rounded-lg flex items-center justify-center">
              <img src="/images/receipt-text.png" alt="Saldo Atual" className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-textSecondary">Saldo atual</h3>
              <p className="text-h4 font-bold text-textPrimary">{formatToBRL(saldoAtual)}</p>
            </div>
          </div>
          <button className="text-textSecondary hover:text-textPrimary">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
