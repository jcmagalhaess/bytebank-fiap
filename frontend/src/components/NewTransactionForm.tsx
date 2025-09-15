"use client";

import { useState } from "react";
import type { TransactionType } from "../app/models/transaction";
import { Input } from "./ui/input";
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
    descricao: string;
    categoria: string;
    pdfUrl?: string;
    pdfFileName?: string;
  }) => Promise<void>;
}

export default function NewTransactionForm({ onAdd }: NewTransactionFormProps) {
  const [type, setType] = useState<TransactionType>("deposit");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const transactionOptions = [
    { label: "Receita", value: "deposit", bold: true },
    { label: "Despesa", value: "transfer", bold: true },
  ];
  const [categoria, setCategoria] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [valorErro, setValorErro] = useState("");
  const [categoriaErro, setCategoriaErro] = useState("");
  const [descricaoErro, setDescricaoErro] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

  function handleCategoriaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = e.target.value;
    setCategoria(valor);
    
    // Limpa o erro quando o usuário começa a digitar
    if (categoriaErro) {
      setCategoriaErro("");
    }
    
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

  function validateDescricao(d: string) {
    if (!d.trim()) return "A descrição é obrigatória";
    if (d.trim().length < 3) return "A descrição deve ter pelo menos 3 caracteres";
    return "";
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    // Limita a 11 dígitos (máximo R$ 999.999.999,99)
    if (raw.length <= 11) {
      setAmount(raw);
    }
    
    // Limpa o erro quando o usuário começa a digitar
    if (valorErro) {
      setValorErro("");
    }
  }

  function resetForm() {
    setType("deposit");
    setAmount("");
    setCategoria("");
    setDescricao("");
    setSugestoes([]);
    setShowSuggestions(false);
    setPdfFile(null);
    setPdfUploaded(false);
    setPdfUrl("");
  }

  function showToast(type: 'success' | 'error', message: string) {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage(null), 3000);
  }

  async function handlePdfUpload(file: File) {
    // Validação do tipo de arquivo
    if (file.type !== 'application/pdf') {
      showToast('error', 'Apenas arquivos PDF são permitidos');
      return;
    }

    // Validação do tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'O arquivo deve ter no máximo 5MB');
      return;
    }

    setPdfUploading(true);
    setPdfFile(file);

    try {
      // Simular upload (substitua pela sua lógica de upload real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular URL do arquivo (substitua pela URL real do seu servidor)
      const mockUrl = URL.createObjectURL(file);
      setPdfUrl(mockUrl);
      setPdfUploaded(true);
      showToast('success', 'Comprovante carregado com sucesso!');
    } catch (error) {
      showToast('error', 'Erro ao carregar o comprovante. Tente novamente.');
      setPdfFile(null);
    } finally {
      setPdfUploading(false);
    }
  }

  function handlePdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handlePdfUpload(file);
    }
  }

  function removePdf() {
    setPdfFile(null);
    setPdfUploaded(false);
    setPdfUrl("");
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
      descricao: descricao.trim(),
      pdfUrl: pdfUrl || undefined,
      pdfFileName: pdfFile?.name || undefined,
    };

    await onAdd(transactionData);
    setLoading(false);
    resetForm();
  }

  // Validação do formulário - checagem dos campos categoria, valor e descrição
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const erroValor = validateValor(amount);
    const erroCategoria = validateCategoria(categoria);
    const erroDescricao = validateDescricao(descricao);

    setValorErro(erroValor);
    setCategoriaErro(erroCategoria);
    setDescricaoErro(erroDescricao);

    if (erroValor || erroCategoria || erroDescricao) return;

    setShowModal(true);
  }

  return (
    <div className="w-full">
      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between bg-white p-6 rounded-xl shadow-md relative w-full min-h-[550px]"
      >
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[#0A2A4D] mb-5">
            Adicionar nova transação
          </h2>

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
              label="Descrição"
              type="text"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
                // Limpa o erro quando o usuário começa a digitar
                if (descricaoErro) {
                  setDescricaoErro("");
                }
              }}
              placeholder="Ex: Compra no supermercado, Pagamento de conta..."
              error={descricaoErro}
              maxLength={50}
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
              placeholder="Digite aqui o valor da transação"
              error={valorErro}
              maxLength={15}
            />
          </div>

          {/* Campo de Upload de PDF */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comprovante (opcional)
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfChange}
                className="hidden"
                id="pdf-upload"
                disabled={pdfUploading}
              />
              <label
                htmlFor="pdf-upload"
                className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
                  pdfUploading
                    ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
                    : pdfUploaded
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                {pdfUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-600">Carregando...</span>
                  </>
                ) : pdfUploaded ? (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-green-600">{pdfFile?.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removePdf();
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-600">Anexar PDF (máx. 5MB)</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="lg:w-[195px] md:w-[195px] sm:w-[150px] pt-3 pb-5">
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

      {/* Toast de notificação */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toastMessage.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{toastMessage.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
