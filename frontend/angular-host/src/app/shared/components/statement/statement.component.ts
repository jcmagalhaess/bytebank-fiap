import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../ui/button/button.component';
import { EditTransactionModalComponent, Transaction } from '../transaction';

@Component({
  selector: 'app-statement',
  standalone: true,
  imports: [CommonModule, ButtonComponent, EditTransactionModalComponent],
  templateUrl: './statement.component.html'
})
export class StatementComponent {
  @Input() transactions: Transaction[] = [];
  @Input() limit: number = 4;
  @Output() refresh = new EventEmitter<void>();

  deleteId: number | null = null;
  editingTransaction: Transaction | null = null;

  onEdit(transaction: Transaction): void {
    this.editingTransaction = transaction;
  }

  onDelete(id: number | undefined): void {
    if (id !== undefined) {
      this.deleteId = id;
    }
  }

  onDeleteConfirm(): void {
    if (this.deleteId !== null) {
      this.handleDelete(this.deleteId);
    }
  }

  onDeleteCancel(): void {
    this.deleteId = null;
  }

  onSave(updated: Transaction): void {
    this.handleSave(updated);
  }

  onEditClose(): void {
    this.editingTransaction = null;
  }

  private handleDelete(id: number): void {
    // Simular exclusão - em um app real, chamaria um serviço
    console.log('Excluindo transação:', id);
    this.deleteId = null;
    this.refresh.emit();
  }

  private handleSave(updated: Transaction): void {
    // Simular atualização - em um app real, chamaria um serviço
    console.log('Atualizando transação:', updated);
    this.editingTransaction = null;
    this.refresh.emit();
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  formatDate(dateString: string): string {
    return dateString.split('-').reverse().join('/');
  }

  getDisplayedTransactions(): Transaction[] {
    return this.transactions
      .slice()
      .reverse()
      .slice(0, this.limit);
  }
}
