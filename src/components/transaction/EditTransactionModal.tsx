import type { TransactionType } from "@/app/models/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatToBRL } from "@/utils/format";
import { useEffect, useState } from "react";

// Definição da interface de props no mesmo arquivo para evitar dependências
interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: {
    id: number;
    type: TransactionType;
    amount: number;
  } | null;
  onSave: (updated: {
    id: number;
    type: TransactionType;
    amount: number;
  }) => void;
  onClose: () => void;
}

export function EditTransactionModal({
  isOpen,
  transaction,
  onSave,
  onClose,
}: EditTransactionModalProps) {
  const [type, setType] = useState<TransactionType>("deposit");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const transactionOptions = [
    { label: "Depósito", value: "deposit", bold: true },
    { label: "Transferência", value: "transfer", bold: true },
  ];

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(Math.round(transaction.amount * 100).toString());
      setErrorMessage(""); // Limpa a mensagem de erro ao abrir o modal
    }
  }, [transaction]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setAmount(raw);
  };

  function handleSave() {
    const parsedAmount = Number(amount) / 100;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Por favor, informe um valor válido maior que zero.");
      return;
    }

    if (transaction) {
      onSave({
        id: transaction.id,
        type,
        amount: parsedAmount,
      });
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-[#0A2A4D]">
          Editar Transação
        </h2>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        <div className="mb-4">
          <Select
            label="Tipo de transação"
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            options={transactionOptions}
          />
        </div>

        <div className="mb-4">
          <Input
            label="Valor"
            type="text"
            value={amount ? formatToBRL(amount) : ""}
            onChange={handleAmountChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            inputMode="numeric"
            required
            placeholder="Digite aqui o valor da transação"
          />
        </div>

        <div className="w-full flex justify-center">
          <div className="flex justify-end gap-4 w-[60%]">
            <Button variant="danger" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
