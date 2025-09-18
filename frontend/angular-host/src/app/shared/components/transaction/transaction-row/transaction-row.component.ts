import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModalComponent } from '../pdf-viewer-modal/pdf-viewer-modal.component';
import { ArrowUpIconComponent } from '../../icons/arrow-up-icon.component';
import { ArrowDownIconComponent } from '../../icons/arrow-down-icon.component';
import { UploadIconComponent } from '../../icons/upload-icon.component';
import { TransactionType } from '../edit-transaction-modal/edit-transaction-modal.component';

export type TransactionName = 'Receita' | 'Despesa';

export const TransactionTypeNameMap: Record<TransactionType, TransactionName> = {
  deposit: 'Receita',
  transfer: 'Despesa',
};

@Component({
  selector: 'app-transaction-row',
  standalone: true,
  imports: [CommonModule, PdfViewerModalComponent, ArrowUpIconComponent, ArrowDownIconComponent, UploadIconComponent],
  templateUrl: './transaction-row.component.html'
})
export class TransactionRowComponent {
  @Input() type: TransactionType = 'deposit';
  @Input() name?: string;
  @Input() date: string = '';
  @Input() amount: string = '';
  @Input() categoria?: string;
  @Input() descricao?: string;
  @Input() pdfUrl?: string;
  @Input() pdfFileName?: string;

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() pdfDelete = new EventEmitter<void>();

  showPdfModal = signal(false);

  get transactionName(): TransactionName {
    return TransactionTypeNameMap[this.type];
  }

  get isDeposit(): boolean {
    return this.type === 'deposit';
  }

  get hasPdf(): boolean {
    return !!(this.pdfUrl && this.pdfFileName);
  }

  onEdit(): void {
    this.edit.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }

  onPdfClick(): void {
    if (this.hasPdf) {
      this.showPdfModal.set(true);
    }
  }

  onPdfDownload(): void {
    if (this.pdfUrl) {
      const link = document.createElement('a');
      link.href = this.pdfUrl;
      link.download = this.pdfFileName || 'comprovante.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  onPdfDelete(): void {
    this.pdfDelete.emit();
    this.showPdfModal.set(false);
  }

  closePdfModal(): void {
    this.showPdfModal.set(false);
  }
}
