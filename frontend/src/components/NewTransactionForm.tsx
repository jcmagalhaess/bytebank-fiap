"use client";

import { useState } from "react";
import type { TransactionType } from "../app/models/transaction";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { formatToBRL } from "../utils/format";
import { getTodayISO } from "../utils/date";
import { 
  findCategoryBySynonym, 
  getCategorySuggestions, 
  getAllCategories 
} from "../config/categories-simple";

interface NewTransactionFormProps {
  onAdd: (newTransaction: {
    type: TransactionType;
    amount: number;
    date: string;
  }) => Promise<void>;
}

export default function NewTransactionForm({ onAdd }: NewTransactionFormProps) {
  const [type, setType] = useState<TransactionType>("deposit");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const transactionOptions = [
    { label: "Depósito", value: "deposit", bold: true },
    { label: "Transferência", value: "transfer", bold: true },
  ];
  const [categoria, setCategoria] = useState<string>("");
  const [valorErro, setValorErro] = useState("");
  const [categoriaErro, setCategoriaErro] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  function handleCategoriaChange(e: React.ChangeEvent<HTMLInputElement>) {
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
  }

  function validateValor(v: string) {
    if (!v) return "O valor é obrigatório";
    const num = Number(v.replace(",", "."));
    if (isNaN(num)) return "Digite apenas números";
    if (num <= 0) return "O valor deve ser maior que zero";
    return "";
  }

  function validateCategoria(c: string) {
    if (!c) return "A categoria é obrigatória";
    
    // Verifica se a categoria digitada é válida (exata ou sinônimo)
    const categoriaValida = findCategoryBySynonym(c);
    if (!categoriaValida) {
      return "Categoria inválida. Selecione uma das sugestões ou digite um sinônimo válido.";
    }
    
    return "";
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    setAmount(raw);
  }

  function resetForm() {
    setType("deposit");
    setAmount("");
    setCategoria("");
    setSugestoes([]);
    setShowSuggestions(false);
  }

  async function confirmTransaction() {
    setLoading(true);
    setShowModal(false);

    // Converte sinônimo para categoria oficial se necessário
    const categoriaFinal = findCategoryBySynonym(categoria) || categoria;

    const transactionData = {
      type,
      amount: Number(amount) / 100,
      date: getTodayISO(),
      categoria: categoriaFinal,
    };

    await onAdd(transactionData);
    setLoading(false);
    resetForm();
  }

  // Validação do formulário - checagem dos campos categoria e valor
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const erroValor = validateValor(amount);
    const erroCategoria = validateCategoria(categoria);

    setValorErro(erroValor);
    setCategoriaErro(erroCategoria);

    if (erroValor || erroCategoria) return;

    setShowModal(true);
  }

  return (
    <div className="w-full ml-auto sm:max-w-[100%] lg:max-w-[100%] xl:max-w-[90%]">
      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md relative sm:w-[100%]"
      >
        <h2 className="text-lg font-semibold text-[#0A2A4D] mb-4">
          Adicionar nova transação
        </h2>

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
            error={categoriaErro}
            placeholder="Ex: combustível, gasolina, alimentação..."
          />
          {showSuggestions && sugestoes.length > 0 && (
            <ul className="absolute bg-white border rounded w-full mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
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

        <div className="mb-4">
          <Input
            label="Valor"
            type="text"
            value={amount ? formatToBRL(amount) : ""}
            onChange={handleAmountChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            inputMode="numeric"
            placeholder="Digite aqui o valor da transação"
            error={valorErro}
          />
        </div>

        <div className="mb-4">
          <Select
            label="Tipo de transação"
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            options={transactionOptions}
          />
        </div>
        <div className="lg:w-[195px] md:w-[195px] sm:w-[150px]">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Aguarde..." : "Adicionar Transação"}
          </Button>
        </div>
      </form>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Confirmar transação</h3>
            <p className="mb-6">
              Tem certeza que deseja adicionar esta transação?
            </p>
            <div className="w-full flex justify-center">
              <div className="flex justify-center gap-4 w-[60%]">
                <Button variant="danger" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={confirmTransaction}>
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
