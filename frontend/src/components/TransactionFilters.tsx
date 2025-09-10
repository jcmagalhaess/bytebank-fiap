'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';

export interface FilterState {
  type: 'all' | 'deposit' | 'transfer';
  startDate: string;
  endDate: string;
  category: string;
  minValue: string;
  maxValue: string;
  search: string;
}

interface TransactionFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  availableCategories: string[];
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  availableCategories
}: TransactionFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
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

  return (
    <div className="bg-backgroundPrimary rounded-xl shadow-md p-6 mb-6 w-full">
      {/* Header com título e botão de limpar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brandPrimary/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-brandPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
          </div>
          <h3 className="text-h5 font-semibold text-textPrimary">
            Filtros de Transações
          </h3>
        </div>
        {hasActiveFilters() && (
          <Button
            variant="secondary"
            onClick={onClearFilters}
            className="text-sm px-4 py-2"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Filtros essenciais - sempre visíveis */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Busca */}
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar
          </label>
          <Input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Descrição ou categoria..."
            className="w-full"
          />
        </div>

        {/* Tipo */}
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Tipo
          </label>
          <Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            options={[
              { label: 'Todas', value: 'all' },
              { label: 'Receitas', value: 'deposit' },
              { label: 'Despesas', value: 'transfer' }
            ]}
          />
        </div>

        {/* Categoria */}
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Categoria
          </label>
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={[
              { label: 'Todas', value: '' },
              ...availableCategories.map((category) => ({
                label: category,
                value: category
              }))
            ]}
          />
        </div>

        {/* Botão Mais Filtros */}
        <div className="flex items-end">
          <Button
            variant="secondary"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-6 py-2 h-10 text-sm font-medium bg-brandPrimary text-white hover:bg-brandPrimary/90 border-0 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-center"
          >
            <svg className={`w-4 h-4 mr-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showAdvancedFilters ? 'Menos filtros' : 'Mais filtros'}
          </Button>
        </div>
      </div>

      {/* Filtros avançados - colapsáveis */}
      {showAdvancedFilters && (
        <div className="pt-4 border-t border-backgroundSecondary">
          <div className="flex flex-col xl:flex-row gap-4">
            {/* Data inicial */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Data inicial
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full"
              />
            </div>
            
            {/* Data final */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Data final
              </label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Valor mínimo */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Valor mínimo
              </label>
              <Input
                type="number"
                value={filters.minValue}
                onChange={(e) => handleFilterChange('minValue', e.target.value)}
                placeholder="0,00"
                step="0.01"
                min="0"
                className="w-full"
              />
            </div>
            
            {/* Valor máximo */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Valor máximo
              </label>
              <Input
                type="number"
                value={filters.maxValue}
                onChange={(e) => handleFilterChange('maxValue', e.target.value)}
                placeholder="0,00"
                step="0.01"
                min="0"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Resumo dos filtros ativos */}
      {hasActiveFilters() && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Filtros Ativos:
          </h4>
          <div className="flex flex-wrap gap-2">
            {filters.type !== 'all' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Tipo: {filters.type === 'deposit' ? 'Depósito' : 'Transferência'}
              </span>
            )}
            {filters.startDate && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                De: {new Date(filters.startDate).toLocaleDateString('pt-BR')}
              </span>
            )}
            {filters.endDate && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Até: {new Date(filters.endDate).toLocaleDateString('pt-BR')}
              </span>
            )}
            {filters.category && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Categoria: {filters.category}
              </span>
            )}
            {filters.minValue && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Mín: R$ {parseFloat(filters.minValue).toFixed(2)}
              </span>
            )}
            {filters.maxValue && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Máx: R$ {parseFloat(filters.maxValue).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
