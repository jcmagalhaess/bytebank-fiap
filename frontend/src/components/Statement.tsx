import { Transaction } from "@/app/models/transaction";
import { TransactionService } from "@/app/services/transactionService";
import { formatToBRL } from "@/utils/format";
import { useEffect, useState } from "react";
import { PageContainer } from "./pageContainer";
import { EditTransactionModal } from "./transaction/EditTransactionModal";
import { TransactionRow } from "./transaction/transactionRow";
import { Button } from "./ui/button";

interface StatementProps {
  transactions: Transaction[];
  limit?: number;
  onRefresh: () => void;
}

export default function Statement({
  transactions: propTransactions,
  limit = 5,
  onRefresh,
}: StatementProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  async function handleDelete(id: number) {
    TransactionService.delete(id);
    setDeleteId(null);
    onRefresh(); // Chama apenas o callback do pai
  }

  async function handleSave(updated: {
    id: number;
    type: "deposit" | "transfer";
    amount: number;
  }) {
    TransactionService.update(updated.id, updated);
    setEditingTransaction(null);
    onRefresh(); // Chama apenas o callback do pai
  }

  return (
    <PageContainer
      id="statement-container"
      variant="sectioned"
      className="max-w-[1200px] w-full"
    >
      {propTransactions.length === 0 ? (
        <p id="no-transactions-message" className="text-gray-400">Nenhuma transação encontrada.</p>
      ) : (
        <div id="transactions-list">
          {propTransactions
            .slice()
            .reverse()
            .slice(0, limit)
            .map((t) => {
              
              const formattedAmount = formatToBRL(t.amount);

              return (
                <TransactionRow
                  key={t.id}
                  id={`transaction-row-${t.id}`}
                  type={t.type}
                  date={t.date.split("-").reverse().join("/")}
                  amount={formattedAmount}
                  categoria={t.categoria || 'Geral'}
                  descricao={t.descricao}
                  onEdit={() => setEditingTransaction(t)}
                  onDelete={() => setDeleteId(t.id)}
                  pdfUrl={t.pdfUrl}
                  pdfFileName={t.pdfFileName}
                  onPdfDelete={() => {
                    TransactionService.deletePdf(t.id);
                    onRefresh(); // Recarrega as transações para atualizar a UI
                  }}
                />
              );
            })}
        </div>
      )}
      <EditTransactionModal
        isOpen={!!editingTransaction}
        transaction={
          editingTransaction
            ? {
                id: editingTransaction.id,
                type: editingTransaction.type,
                amount: editingTransaction.amount,
                categoria: editingTransaction.categoria,
              }
            : null
        }
        onClose={() => setEditingTransaction(null)}
        onSave={handleSave}
      />

      {/* Modal de confirmação de exclusão */}
      {deleteId !== null && (
        <div id="delete-confirmation-modal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div id="delete-modal-content" className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h3 id="delete-modal-title" className="text-lg font-semibold mb-4 text-[#0A2A4D]">
              Confirmar exclusão
            </h3>
            <p id="delete-modal-message" className="mb-6">
              Tem certeza que deseja excluir esta transação?
            </p>
            <div className="w-full flex justify-center">
              <div id="delete-modal-buttons" className="flex justify-center gap-4">
                <Button id="delete-cancel-button" variant="primary" onClick={() => setDeleteId(null)}>
                  Cancelar
                </Button>
                <Button
                  id="delete-confirm-button"
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
    </PageContainer>
  );
}
