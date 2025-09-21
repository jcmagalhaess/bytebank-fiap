import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrowUpIconComponent } from '../../icons/arrow-up-icon.component';
import { ArrowDownIconComponent } from '../../icons/arrow-down-icon.component';

@Component({
  selector: 'app-transaction-row',
  standalone: true,
  imports: [CommonModule, ArrowUpIconComponent, ArrowDownIconComponent],
  templateUrl: './transaction-row.component.html',
})
export class TransactionRowComponent {
  @Input() type!: 'deposit' | 'transfer';
  @Input() date!: string;
  @Input() amount!: string;
  @Input() categoria?: string;
  @Input() descricao?: string;
  @Input() pdfUrl?: string;
  @Input() pdfFileName?: string;

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() pdfDelete = new EventEmitter<void>();

  onEdit(): void {
    this.edit.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }

  onPdfDelete(): void {
    this.pdfDelete.emit();
  }
}
