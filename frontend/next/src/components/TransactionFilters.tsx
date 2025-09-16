'use client';

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
      filters.maxValue !== ''
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#0A2A4D]">
          Filtrar por:
        </h3>
        {hasActiveFilters() && (
          <Button
            variant="secondary"
            onClick={onClearFilters}
            className="text-sm"
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-6 gap-4">
        {/* Filtro por Tipo */}
        <div>
          <Select
            label="Tipo"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            options={[
              { label: 'Todos', value: 'all' },
              { label: 'Depósito', value: 'deposit' },
              { label: 'Transferência', value: 'transfer' }
            ]}
          />
        </div>

        {/* Filtro por Data Início */}
        <div>
          <Input
            label="Data Início"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            placeholder="Selecione a data"
          />
        </div>

        {/* Filtro por Data Fim */}
        <div>
          <Input
            label="Data Fim"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            placeholder="Selecione a data"
          />
        </div>

        {/* Filtro por Categoria */}
        <div>
          <Select
            label="Categoria"
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

        {/* Filtro por Valor Mínimo */}
        <div>
          <Input
            label="Valor Mín (R$)"
            type="number"
            value={filters.minValue}
            onChange={(e) => handleFilterChange('minValue', e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>

        {/* Filtro por Valor Máximo */}
        <div>
          <Input
            label="Valor Máx (R$)"
            type="number"
            value={filters.maxValue}
            onChange={(e) => handleFilterChange('maxValue', e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
      </div>

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
