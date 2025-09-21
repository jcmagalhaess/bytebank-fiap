'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { SearchIcon } from './icons/searchIcon';

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
  isDropdown?: boolean;
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  availableCategories,
  isDropdown = false
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
    <div id="transaction-filters-container" className="bg-backgroundPrimary rounded-xl shadow-md p-6 mb-6 w-full">
      {/* Header com título e botão de limpar - só mostra se não for dropdown */}
      {!isDropdown && (
        <div id="filters-header" className="flex items-center justify-between mb-6">
          <div id="filters-title-section" className="flex items-center gap-3">
            <div id="filters-icon-container" className="w-8 h-8 bg-brandPrimary/10 rounded-lg flex items-center justify-center">
              <svg id="filters-icon" className="w-5 h-5 text-brandPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </div>
            <h3 id="filters-title" className="text-h5 font-semibold text-textPrimary">
              Filtros de Transações
        </h3>
          </div>
        {hasActiveFilters() && (
          <Button
              id="clear-filters-button"
            variant="secondary"
            onClick={onClearFilters}
              className="text-sm px-4 py-2"
          >
              <svg id="clear-filters-icon" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            Limpar Filtros
          </Button>
        )}
      </div>
      )}


      {/* Filtros essenciais - sempre visíveis */}
      <div id="essential-filters-row" className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Busca - só mostra se não for dropdown */}
        {!isDropdown && (
          <div id="search-filter-container" className="flex-1 space-y-2">
          <label id="search-filter-label" className="text-sm font-medium text-textSecondary flex items-center gap-2">
            <SearchIcon className="w-4 h-4" />
            Buscar
          </label>
            <Input
              id="search-filter-input"
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Descrição ou categoria..."
              className="w-full"
            />
          </div>
        )}

        {/* Tipo */}
        <div id="type-filter-container" className="flex-1 space-y-2">
          <label id="type-filter-label" className="text-sm font-medium text-textSecondary flex items-center gap-2">
            <svg id="type-filter-icon" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Tipo
          </label>
          <Select
            id="type-filter-select"
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
        <div id="category-filter-container" className="flex-1 space-y-2">
          <label id="category-filter-label" className="text-sm font-medium text-textSecondary flex items-center gap-2">
            <svg id="category-filter-icon" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Categoria
          </label>
          <Select
            id="category-filter-select"
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

        {/* Botão Limpar Filtros - sempre visível no dropdown */}
        {isDropdown && (
          <div className="w-20 space-y-2">
            <label className="text-sm font-medium text-textSecondary opacity-0">
              Limpar
            </label>
            <Button
              id="clear-filters-dropdown-button"
              variant="secondary"
              onClick={onClearFilters}
              disabled={!hasActiveFilters()}
              className="w-full flex items-center justify-center gap-1 px-2 py-2 bg-backgroundSecondary hover:bg-backgroundSecondary/80 text-textSecondary text-xs font-medium rounded-lg border border-backgroundSecondary transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar
            </Button>
          </div>
        )}

        {/* Botão Mais Filtros - só mostra se não for dropdown */}
        {!isDropdown && (
          <div id="more-filters-button-container" className="flex items-end">
            <Button
              id="more-filters-button"
              variant="secondary"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-6 py-2 h-10 text-sm font-medium bg-brandPrimary text-white hover:bg-brandPrimary/90 border-0 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-center"
            >
              <svg id="more-filters-icon" className={`w-4 h-4 mr-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showAdvancedFilters ? 'Menos filtros' : 'Mais filtros'}
            </Button>
          </div>
        )}
      </div>

      {/* Filtros avançados - colapsáveis ou sempre visíveis no dropdown */}
      {(showAdvancedFilters || isDropdown) && (
        <div id="advanced-filters-section" className="pt-4 border-t border-backgroundSecondary">
          <div id="advanced-filters-row" className="flex flex-col xl:flex-row gap-4">
            {/* Data inicial */}
            <div id="start-date-filter-container" className="flex-1 space-y-2">
              <label id="start-date-filter-label" className="text-sm font-medium text-textSecondary flex items-center gap-2">
                <svg id="start-date-filter-icon" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Data inicial
              </label>
              <Input
                id="start-date-filter-input"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full"
              />
            </div>
            
            {/* Data final */}
            <div id="end-date-filter-container" className="flex-1 space-y-2">
              <label id="end-date-filter-label" className="text-sm font-medium text-textSecondary flex items-center gap-2">
                <svg id="end-date-filter-icon" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Data final
              </label>
              <Input
                id="end-date-filter-input"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Valor mínimo */}
            <div id="min-value-filter-container" className="flex-1 space-y-2">
              <label id="min-value-filter-label" className="text-sm font-medium text-textSecondary flex items-center gap-2">
                <svg id="min-value-filter-icon" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Valor mínimo
              </label>
          <Input
                id="min-value-filter-input"
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
            <div id="max-value-filter-container" className="flex-1 space-y-2">
              <label id="max-value-filter-label" className="text-sm font-medium text-textSecondary flex items-center gap-2">
                <svg id="max-value-filter-icon" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Valor máximo
              </label>
          <Input
                id="max-value-filter-input"
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
        <div id="active-filters-summary" className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 id="active-filters-title" className="text-sm font-medium text-blue-800 mb-2">
            Filtros Ativos:
          </h4>
          <div id="active-filters-tags" className="flex flex-wrap gap-2">
            {filters.type !== 'all' && (
              <span id="active-filter-type" className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Tipo: {filters.type === 'deposit' ? 'Depósito' : 'Transferência'}
              </span>
            )}
            {filters.startDate && (
              <span id="active-filter-start-date" className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                De: {new Date(filters.startDate).toLocaleDateString('pt-BR')}
              </span>
            )}
            {filters.endDate && (
              <span id="active-filter-end-date" className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Até: {new Date(filters.endDate).toLocaleDateString('pt-BR')}
              </span>
            )}
            {filters.category && (
              <span id="active-filter-category" className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Categoria: {filters.category}
              </span>
            )}
            {filters.minValue && (
              <span id="active-filter-min-value" className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Mín: R$ {parseFloat(filters.minValue).toFixed(2)}
              </span>
            )}
            {filters.maxValue && (
              <span id="active-filter-max-value" className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Máx: R$ {parseFloat(filters.maxValue).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
