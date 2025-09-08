import { useState, useEffect } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  currentData: T[];
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  startIndex: number;
  endIndex: number;
}

export function usePagination<T>({
  data,
  itemsPerPage
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  
  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;
  
  const nextPage = () => {
    if (canGoNext) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (canGoPrev) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Reset para página 1 quando os dados mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);
  
  return {
    currentPage,
    totalPages,
    currentData,
    setCurrentPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    startIndex,
    endIndex
  };
}
