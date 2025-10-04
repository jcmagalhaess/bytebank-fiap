import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../interfaces/transaction.interface';
import { TransactionRowComponent } from '../transaction-row/transaction-row.component';

@Component({
  selector: 'app-transaction-list-with-pagination',
  standalone: true,
  imports: [CommonModule, TransactionRowComponent],
  templateUrl: './transaction-list-with-pagination.component.html',
})
export class TransactionListWithPaginationComponent {
  @Input() transactions: Transaction[] = [];
  @Input() itemsPerPage: number = 10;

  @Output() edit = new EventEmitter<Transaction>();
  @Output() delete = new EventEmitter<number>();

  currentPage = signal(1);

  // Computed properties para paginação
  totalPages = computed(() => Math.ceil(this.transactions.length / this.itemsPerPage));

  startIndex = computed(() => (this.currentPage() - 1) * this.itemsPerPage);

  endIndex = computed(() => this.startIndex() + this.itemsPerPage);

  currentTransactions = computed(() => {
    const start = this.startIndex();
    const end = this.endIndex();
    const result = this.transactions.slice(start, end).slice().reverse();
    console.log('🔍 currentTransactions - start:', start, 'end:', end, 'result.length:', result.length);
    console.log('📋 currentTransactions result:', result);
    return result;
  });

  hasTransactions = computed(() => {
    console.log('🔍 hasTransactions - transactions.length:', this.transactions.length);
    console.log('📋 transactions:', this.transactions);
    return this.transactions.length > 0;
  });

  handlePageChange(page: number): void {
    this.currentPage.set(page);
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleEdit(transaction: Transaction): void {
    this.edit.emit(transaction);
  }

  handleDelete(id: number): void {
    this.delete.emit(id);
  }

  formatToBRL(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return dateString.split('-').reverse().join('/');
  }
}
