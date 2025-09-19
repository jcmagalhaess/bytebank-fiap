import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../edit-transaction-modal/edit-transaction-modal.component';
import { TransactionRowComponent } from '../transaction-row/transaction-row.component';
import { PaginationComponent } from '../../ui/pagination/pagination.component';

@Component({
  selector: 'app-transaction-list-with-pagination',
  standalone: true,
  imports: [CommonModule, TransactionRowComponent, PaginationComponent],
  templateUrl: './transaction-list-with-pagination.component.html',
})
export class TransactionListWithPaginationComponent {
  @Input() transactions: Transaction[] = [];
  @Input() itemsPerPage: number = 10;

  @Output() onEdit = new EventEmitter<Transaction>();
  @Output() onDelete = new EventEmitter<number>();

  currentPage = signal(1);

  // Computed properties para paginação
  totalPages = computed(() => Math.ceil(this.transactions.length / this.itemsPerPage));

  startIndex = computed(() => (this.currentPage() - 1) * this.itemsPerPage);

  endIndex = computed(() => this.startIndex() + this.itemsPerPage);

  currentTransactions = computed(() => {
    const start = this.startIndex();
    const end = this.endIndex();
    return this.transactions.slice(start, end).slice().reverse();
  });

  get hasTransactions(): boolean {
    return this.transactions.length > 0;
  }

  handlePageChange(page: number): void {
    this.currentPage.set(page);
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleEdit(transaction: Transaction): void {
    this.onEdit.emit(transaction);
  }

  handleDelete(id: number | undefined): void {
    if (id !== undefined) {
      this.onDelete.emit(id);
    }
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
