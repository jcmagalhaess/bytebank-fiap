"use client";

import { TransactionName, TransactionType, TransactionTypeNameMap } from "@/app/models/transaction";
import { ArrowDownIcon } from "../icons/arrowDownIcon";
import { ArrowUpIcon } from "../icons/arrowUpIcon";
import { EditIcon } from "../icons/editIcon";
import { TrashIcon } from "../icons/trashIcon";

interface TransactionRowProps {
  type: TransactionType;
  name?: string;
  date: string;
  amount: string;
  onEdit?: () => void;
  onDelete?: () => void;
}
export function TransactionRow({
  type,
  date,
  amount,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  const Icon = type === "deposit" ? ArrowUpIcon : ArrowDownIcon;
  const name: TransactionName = TransactionTypeNameMap[type];

  return (
    <div className="w-full border-b border-backgroundSecondary py-4 text-xs sm:text-sm text-textPrimary font-inter">

      {/* Mobile layout */}
      <div className="flex flex-col sm:hidden gap-2">

        {/* Linha 1: ícone, nome e data */}
        <div className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-transparent">
            <Icon className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{name}</span>
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
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:grid grid-cols-[repeat(4,minmax(0,1fr))] gap-6 md:gap-0 x:gap-[50px] xl:gap-0 items-center w-[120%] lg:gap-0">

        {/* Transação */}
        <div className="flex items-center gap-2 overflow-x-hidden">
          <div className="rounded-full p-2 bg-transparent">
            <Icon className="text-white" />
          </div>
          <span className="font-semibold">{name}</span>
        </div>

        {/* Data */}
        <span>{date}</span>

        {/* Valor */}
        <span className="font-bold">{amount}</span>

        {/* Ações */}
        <div className="flex gap-2 -ml-[30px]">
          <button onClick={onEdit}>
            <EditIcon className="text-textPrimary hover:text-feedbackInfo w-5 h-5" />
          </button>
          <button onClick={onDelete}>
            <TrashIcon className="text-textPrimary hover:text-feedbackDanger w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}