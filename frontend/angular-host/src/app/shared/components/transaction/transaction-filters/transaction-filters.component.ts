import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../ui/button/button.component';
import { InputComponent } from '../ui/input/input.component';
import { SelectComponent } from '../ui/select/select.component';

export interface FilterState {
  type: 'all' | 'deposit' | 'transfer';
  startDate: string;
  endDate: string;
  category: string;
  minValue: string;
  maxValue: string;
  search: string;
}

@Component({
  selector: 'app-transaction-filters',
  standalone: true,
  imports: [CommonModule, ButtonComponent, InputComponent, SelectComponent],
  templateUrl: './transaction-filters.component.html'
})
export class TransactionFiltersComponent {
  @Input() filters: FilterState = {
    type: 'all',
    startDate: '',
    endDate: '',
    category: '',
    minValue: '',
    maxValue: '',
    search: ''
  };
  @Input() availableCategories: string[] = [];
  @Input() isDropdown: boolean = false;

  @Output() filtersChange = new EventEmitter<FilterState>();
  @Output() clearFilters = new EventEmitter<void>();

  showAdvancedFilters = signal(false);

  typeOptions = [
    { label: 'Todas', value: 'all' },
    { label: 'Receitas', value: 'deposit' },
    { label: 'Despesas', value: 'transfer' }
  ];

  get categoryOptions() {
    return [
      { label: 'Todas', value: '' },
      ...this.availableCategories.map((category) => ({
        label: category,
        value: category
      }))
    ];
  }

  onFilterChange(key: keyof FilterState, value: string): void {
    const newFilters = {
      ...this.filters,
      [key]: value
    };
    this.filtersChange.emit(newFilters);
  }

  onInputChange(key: keyof FilterState, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onFilterChange(key, target.value);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters.set(!this.showAdvancedFilters());
  }

  hasActiveFilters(): boolean {
    return (
      this.filters.type !== 'all' ||
      this.filters.startDate !== '' ||
      this.filters.endDate !== '' ||
      this.filters.category !== '' ||
      this.filters.minValue !== '' ||
      this.filters.maxValue !== '' ||
      this.filters.search !== ''
    );
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  formatCurrency(value: string): string {
    if (!value) return '';
    return parseFloat(value).toFixed(2);
  }
}
