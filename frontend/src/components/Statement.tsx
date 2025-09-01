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
  transactions,
  limit = 4,
  onRefresh,
}: StatementProps) {
  const [transaction, setTransactions] = useState<Transaction[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  async function fetchTransactions() {
    const list = TransactionService.list();
    setTransactions(list);
    onRefresh();
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

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

  return (
    <PageContainer
      variant="sectioned"
      className="bg-white p-6 rounded-xl shadow-md max-w-[1200px] w-full"
    >
      {transaction.length === 0 ? (
        <p className="text-gray-400">Nenhuma transação encontrada.</p>
      ) : (
        transaction
          .slice()
          .reverse()
          .slice(0, limit)
          .map((t) => (
            <TransactionRow
              key={t.id}
              type={t.type}
              date={t.date.split("-").reverse().join("/")}
              amount={formatToBRL(t.amount)}
              onEdit={() => setEditingTransaction(t)}
              onDelete={() => setDeleteId(t.id)}
            />
          ))
      )}
      <EditTransactionModal
        isOpen={!!editingTransaction}
        transaction={
          editingTransaction
            ? {
                id: editingTransaction.id,
                type: editingTransaction.type,
                amount: editingTransaction.amount,
              }
            : null
        }
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
              <div className="flex justify-center gap-4">
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
    </PageContainer>
  );
}
