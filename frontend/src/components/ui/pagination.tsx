"use client";

import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Informações da página */}
      <div className="text-sm text-gray-600">
        Mostrando <span className="font-bold">{startItem}-{endItem}</span> de <span className="font-bold">{totalItems}</span> registros
      </div>

      {/* Controles de paginação */}
      <div className="flex items-center gap-1">
        {/* Botão Anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm rounded-lg h-10 w-10 bg-transparent text-textSecondary hover:bg-backgroundSecondary disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          &lt;
        </button>

        {/* Números das páginas */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-1 text-sm min-w-[40px] rounded-lg h-10 w-10 transition-colors ${
                    currentPage === page
                      ? "bg-brandPrimary text-white"
                      : "bg-backgroundSecondary hover:bg-blue-200 text-textSecondary"
                  }`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Botão Próximo */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm rounded-lg h-10 w-10 bg-transparent text-textSecondary hover:bg-backgroundSecondary disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
