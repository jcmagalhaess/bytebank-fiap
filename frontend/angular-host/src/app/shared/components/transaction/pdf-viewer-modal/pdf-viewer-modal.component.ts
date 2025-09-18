import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-pdf-viewer-modal',
  templateUrl: './pdf-viewer-modal.component.html',
  standalone: true,
  imports: [CommonModule, ButtonComponent]
})
export class PdfViewerModalComponent {
  @Input() isOpen: boolean = false;
  @Input() pdfUrl: string = '';
  @Input() fileName: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }

  onDownload(): void {
    this.download.emit();
  }
}
