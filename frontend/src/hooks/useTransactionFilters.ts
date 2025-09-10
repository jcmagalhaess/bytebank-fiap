import { useState, useMemo } from 'react';
import type { Transaction } from '../app/models/transaction';
import { FilterState } from '../components/TransactionFilters';

export function useTransactionFilters(transactions: Transaction[]) {
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    startDate: '',
    endDate: '',
    category: '',
    minValue: '',
    maxValue: '',
    search: ''
  });

  // Extrair categorias únicas das transações
  const availableCategories = useMemo(() => {
    const categories = transactions
      .map(t => t.categoria)
      .filter((cat): cat is string => cat !== undefined && cat !== '')
      .filter((cat, index, arr) => arr.indexOf(cat) === index)
      .sort();
    
    return categories;
  }, [transactions]);

  // Aplicar filtros às transações
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Filtro por tipo
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      // Filtro por data
      if (filters.startDate) {
        const transactionDate = new Date(transaction.date);
        const startDate = new Date(filters.startDate);
        if (transactionDate < startDate) {
          return false;
        }
      }

      if (filters.endDate) {
        const transactionDate = new Date(transaction.date);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // Incluir todo o dia
        if (transactionDate > endDate) {
          return false;
        }
      }

      // Filtro por categoria
      if (filters.category && transaction.categoria !== filters.category) {
        return false;
      }

      // Filtro por valor mínimo
      if (filters.minValue) {
        const minValue = parseFloat(filters.minValue);
        if (transaction.amount < minValue) {
          return false;
        }
      }

      // Filtro por valor máximo
      if (filters.maxValue) {
        const maxValue = parseFloat(filters.maxValue);
        if (transaction.amount > maxValue) {
          return false;
        }
      }

      // Filtro por busca (descrição ou categoria)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const description = transaction.descricao?.toLowerCase() || '';
        const category = transaction.categoria?.toLowerCase() || '';
        
        if (!description.includes(searchTerm) && !category.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, filters]);

  const updateFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      startDate: '',
      endDate: '',
      category: '',
      minValue: '',
      maxValue: '',
      search: ''
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.type !== 'all' ||
      filters.startDate !== '' ||
      filters.endDate !== '' ||
      filters.category !== '' ||
      filters.minValue !== '' ||
      filters.maxValue !== '' ||
      filters.search !== ''
    );
  };

  return {
    filters,
    filteredTransactions,
    availableCategories,
    updateFilters,
    clearFilters,
    hasActiveFilters
  };
}
