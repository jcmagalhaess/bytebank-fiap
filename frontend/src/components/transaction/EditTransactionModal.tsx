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
import { PdfViewerModal } from "./PdfViewerModal";
import { TransactionService } from "@/app/services/transactionService";

// Definição da interface de props no mesmo arquivo para evitar dependências
interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: {
    id: number;
    type: TransactionType;
    amount: number;
    categoria?: string;
    descricao?: string;
    pdfUrl?: string;
    pdfFileName?: string;
  } | null;
  onSave: (updated: {
    id: number;
    type: TransactionType;
    amount: number;
    categoria?: string;
    descricao?: string;
    pdfUrl?: string;
    pdfFileName?: string;
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
  const [descricao, setDescricao] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [categoria, setCategoria] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const transactionOptions = [
    { label: "Receita", value: "deposit", bold: true },
    { label: "Despesa", value: "transfer", bold: true },
  ];

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(Math.round(transaction.amount * 100).toString());
      setDescricao(transaction.descricao || "");
      setCategoria(transaction.categoria || "");
      setPdfUrl(transaction.pdfUrl || "");
      setPdfUploaded(!!transaction.pdfUrl);
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
    
    // Se há uma transação sendo editada, remove o PDF dela também
    if (transaction) {
      TransactionService.update(transaction.id, {
        pdfUrl: undefined,
        pdfFileName: undefined
      });
    }
  }

  const handlePdfClick = () => {
    const currentPdfUrl = pdfUrl || transaction?.pdfUrl;
    const currentPdfFileName = transaction?.pdfFileName || pdfFile?.name;
    
    if (currentPdfUrl && currentPdfFileName) {
      setShowPdfModal(true);
    }
  };

  const handlePdfDownload = () => {
    const currentPdfUrl = pdfUrl || transaction?.pdfUrl;
    const currentPdfFileName = transaction?.pdfFileName || pdfFile?.name;
    
    if (currentPdfUrl) {
      const link = document.createElement('a');
      link.href = currentPdfUrl;
      link.download = currentPdfFileName || 'comprovante.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePdfDelete = () => {
    removePdf();
    setShowPdfModal(false);
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
        descricao: descricao.trim(),
        pdfUrl: pdfUrl || undefined,
        pdfFileName: pdfFile?.name || transaction.pdfFileName || undefined,
      });
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
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

        {/* Campo de Descrição */}
        <div className="mb-4">
          <Input
            label="Descrição"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Compra no supermercado, Pagamento de conta..."
            maxLength={50}
          />
        </div>

        {/* Seção de PDF */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comprovante
          </label>
          
          {/* PDF existente */}
          {(pdfUploaded && pdfUrl) || (transaction?.pdfUrl && transaction?.pdfFileName && pdfUrl !== "") ? (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-green-700 font-medium">
                    {transaction?.pdfFileName || pdfFile?.name || 'comprovante.pdf'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePdfClick}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Visualizar
                  </button>
                  <button
                    type="button"
                    onClick={removePdf}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Upload de novo PDF - só aparece se não há PDF existente */}
          {!((pdfUploaded && pdfUrl) || (transaction?.pdfUrl && transaction?.pdfFileName && pdfUrl !== "")) && (
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfChange}
                className="hidden"
                id="pdf-upload-edit"
                disabled={pdfUploading}
              />
              <label
                htmlFor="pdf-upload-edit"
                className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
                  pdfUploading
                    ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                {pdfUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-600">Carregando...</span>
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

      {/* Modal de visualização de PDF */}
      {((pdfUrl || transaction?.pdfUrl) && (transaction?.pdfFileName || pdfFile?.name)) && (
        <PdfViewerModal
          isOpen={showPdfModal}
          pdfUrl={pdfUrl || transaction?.pdfUrl || ""}
          fileName={transaction?.pdfFileName || pdfFile?.name || ""}
          onClose={() => setShowPdfModal(false)}
          onDelete={handlePdfDelete}
          onDownload={handlePdfDownload}
        />
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
