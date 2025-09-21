"use client";

import { useState } from "react";
import {
  TransactionName,
  TransactionType,
  TransactionTypeNameMap,
} from "@/app/models/transaction";
import { ArrowDownIcon } from "../icons/arrowDownIcon";
import { ArrowUpIcon } from "../icons/arrowUpIcon";
import { EditIcon } from "../icons/editIcon";
import { TrashIcon } from "../icons/trashIcon";
import { UploadIcon } from "../icons/uploadIcon";
import { PdfViewerModal } from "./PdfViewerModal";

interface TransactionRowProps {
  type: TransactionType;
  name?: string;
  date: string;
  amount: string;
  categoria?: string;
  descricao?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  pdfUrl?: string;
  pdfFileName?: string;
  onPdfDelete?: () => void;
}
export function TransactionRow({
  type,
  date,
  amount,
  categoria,
  descricao,
  onEdit,
  onDelete,
  pdfUrl,
  pdfFileName,
  onPdfDelete,
}: TransactionRowProps) {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const Icon = type === "deposit" ? ArrowUpIcon : ArrowDownIcon;
  const name: TransactionName = TransactionTypeNameMap[type];

  const handlePdfClick = () => {
    if (pdfUrl && pdfFileName) {
      setShowPdfModal(true);
    }
  };

  const handlePdfDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = pdfFileName || 'comprovante.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePdfDelete = () => {
    if (onPdfDelete) {
      onPdfDelete();
    }
    setShowPdfModal(false);
  };

  return (
    <div className="w-full border-b border-backgroundSecondary py-4 px-4 text-xs sm:text-sm text-textPrimary font-inter">
      {/* Mobile layout */}
      <div className="flex flex-col sm:hidden gap-2">
        {/* Linha 1: ícone, nome e data */}
        <div className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-transparent">
            <Icon className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold block md:hidden">{descricao || name}</span>
            {/* Categoria */}
            <span>
              {categoria ? (
                <span id="categoria">
                  {categoria}
                </span>
              ) : (
                "-"
              )}
            </span>
            <span className="text-xs">{date}</span>
          </div>
        </div>

        {/* Linha 2: valor + ações (lado a lado) */}
        <div className="flex items-center ml-[10px] gap-3">
          <span className="font-bold">{amount}</span>
          <button onClick={onEdit}>
            <EditIcon className="text-textPrimary hover:text-feedbackInfo w-4 h-4" />
          </button>
          <button onClick={onDelete}>
            <TrashIcon className="text-textPrimary hover:text-feedbackDanger w-4 h-4" />
          </button>
          <button onClick={handlePdfClick}>
            <UploadIcon className={`w-4 h-4 ${pdfUrl ? 'text-feedbackSuccess' : 'text-textPrimary hover:text-feedbackSuccess'}`} />
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-6 md:gap-0 x:gap-[50px] xl:gap-0 items-center lg:gap-0">
        {/* Transação - coluna mais larga */}
        <div className="flex md:flex-col lg:flex-row items-center gap-2 overflow-x-hidden">
          <div className="rounded-full p-2 bg-transparent">
            <Icon className="text-white" />
          </div>
          <span className="font-semibold">{descricao || name}</span>
        </div>
        {/* Categoria */}
        <span>
          {categoria ? (
            <span id="categoria">
              {categoria}
            </span>
          ) : (
            "-"
          )}
        </span>
        {/* Data */}
        <span>{date}</span>

        {/* Valor */}
        <span className="font-bold">{amount}</span>

        {/* Ações */}
        <div className="flex gap-2 items-center">
          <button onClick={onEdit}>
            <EditIcon className="text-textPrimary hover:text-feedbackInfo w-5 h-5" />
          </button>
          <button onClick={onDelete}>
            <TrashIcon className="text-textPrimary hover:text-feedbackDanger w-5 h-5" />
          </button>
          <button onClick={handlePdfClick}>
            <UploadIcon className={`w-5 h-5 ${pdfUrl ? 'text-feedbackSuccess' : 'text-textPrimary hover:text-feedbackSuccess'}`} />
          </button>
        </div>
      </div>

      {/* Modal de visualização de PDF */}
      {pdfUrl && pdfFileName && (
        <PdfViewerModal
          isOpen={showPdfModal}
          pdfUrl={pdfUrl}
          fileName={pdfFileName}
          onClose={() => setShowPdfModal(false)}
          onDelete={handlePdfDelete}
          onDownload={handlePdfDownload}
        />
      )}
    </div>
  );
}
