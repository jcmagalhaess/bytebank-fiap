import type { TransactionType } from "@/app/models/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatToBRL } from "@/utils/format";
import { useEffect, useState } from "react";
import { 
  findCategoryBySynonym, 
  getCategorySuggestions, 
  getAllCategories 
} from "../../config/categories-simple";

// Definição da interface de props no mesmo arquivo para evitar dependências
interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: {
    id: number;
    type: TransactionType;
    amount: number;
    categoria?: string;
  } | null;
  onSave: (updated: {
    id: number;
    type: TransactionType;
    amount: number;
    categoria?: string;
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
  const [categoria, setCategoria] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const transactionOptions = [
    { label: "Receita", value: "deposit", bold: true },
    { label: "Despesa", value: "transfer", bold: true },
  ];

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(Math.round(transaction.amount * 100).toString());
      setCategoria(transaction.categoria || "");
      setErrorMessage(""); // Limpa a mensagem de erro ao abrir o modal
      setSugestoes([]);
      setShowSuggestions(false);
    }
  }, [transaction]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setAmount(raw);
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setCategoria(valor);
    
    if (valor.trim()) {
      const sugestoesEncontradas = getCategorySuggestions(valor);
      setSugestoes(sugestoesEncontradas);
      setShowSuggestions(sugestoesEncontradas.length > 0);
    } else {
      setSugestoes([]);
      setShowSuggestions(false);
    }
  };

  function handleSave() {
    const parsedAmount = Number(amount) / 100;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Por favor, informe um valor válido maior que zero.");
      return;
    }

    // Validação da categoria
    if (categoria.trim()) {
      const categoriaValida = findCategoryBySynonym(categoria);
      if (!categoriaValida) {
        setErrorMessage("Categoria inválida. Selecione uma das sugestões ou digite um sinônimo válido.");
        return;
      }
    }

    if (transaction) {
      // Converte sinônimo para categoria oficial se necessário
      const categoriaFinal = categoria.trim() ? (findCategoryBySynonym(categoria) || categoria) : categoria;
      
      onSave({
        id: transaction.id,
        type,
        amount: parsedAmount,
        categoria: categoriaFinal,
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de transação
          </label>
          <div className="flex gap-4">
            {transactionOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="transactionType"
                  value={option.value}
                  checked={type === option.value}
                  onChange={(e) => setType(e.target.value as TransactionType)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <Input
            label="Valor"
            type="text"
            value={amount ? formatToBRL(amount) : ""}
            onChange={handleAmountChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            inputMode="numeric"
            placeholder="Digite aqui o valor da transação"
          />
        </div>
        <div className="mb-4 relative">
          <Input
            label="Categoria"
            type="text"
            value={categoria}
            onChange={handleCategoriaChange}
            onFocus={() => {
              if (categoria.trim()) {
                const sugestoesEncontradas = getCategorySuggestions(categoria);
                setSugestoes(sugestoesEncontradas);
                setShowSuggestions(sugestoesEncontradas.length > 0);
              } else {
                setSugestoes(getAllCategories());
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              // Delay para permitir clique nas sugestões
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Ex: combustível, gasolina, alimentação..."
          />
          {showSuggestions && sugestoes.length > 0 && (
            <ul className="absolute bg-white border rounded w-full mt-1 shadow-lg z-50 max-h-48 overflow-y-auto">
              {sugestoes.map((s) => (
                <li
                  key={s}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    setCategoria(s);
                    setSugestoes([]);
                    setShowSuggestions(false);
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
          {categoria.trim() && !findCategoryBySynonym(categoria) && (
            <div className="text-xs text-gray-500 mt-1">
              💡 Dica: Digite sinônimos como "combustível" para "Transporte" ou "comida" para "Alimentação"
            </div>
          )}
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
