import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { PdfUploadLoaderComponent } from '../../ui/loader/pdf-upload-loader.component';

export interface PdfUploadResult {
  file: File;
  url: string;
  fileName: string;
}

@Component({
  selector: 'app-pdf-upload-modal',
  templateUrl: './pdf-upload-modal.component.html',
  standalone: true,
  imports: [CommonModule, ButtonComponent, PdfUploadLoaderComponent]
})
export class PdfUploadModalComponent {
  @Input() isOpen: boolean = false;
  @Input() transactionId?: number;

  @Output() close = new EventEmitter<void>();
  @Output() upload = new EventEmitter<PdfUploadResult>();

  // Estados do upload
  pdfFile: File | null = null;
  pdfUploading: boolean = false;
  pdfUploaded: boolean = false;
  pdfUrl: string = '';
  errorMessage: string = '';

  onClose(): void {
    this.close.emit();
    this.resetForm();
  }

  onPdfChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (file) {
      this.handlePdfUpload(file);
    }
  }

  async handlePdfUpload(file: File): Promise<void> {
    // Validação do tipo de arquivo
    if (file.type !== 'application/pdf') {
      this.errorMessage = 'Apenas arquivos PDF são permitidos';
      return;
    }

    // Validação do tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'O arquivo deve ter no máximo 5MB';
      return;
    }

    this.errorMessage = '';
    this.pdfUploading = true;
    this.pdfFile = file;

    try {
      // Simular upload (substitua pela sua lógica de upload real)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular URL do arquivo (substitua pela URL real do seu servidor)
      const mockUrl = URL.createObjectURL(file);
      this.pdfUrl = mockUrl;
      this.pdfUploaded = true;
    } catch (error) {
      this.errorMessage = 'Erro ao carregar o comprovante. Tente novamente.';
      this.pdfFile = null;
    } finally {
      this.pdfUploading = false;
    }
  }

  onConfirmUpload(): void {
    console.log('📎 PDF Upload Modal - onConfirmUpload:', {
      hasPdfFile: !!this.pdfFile,
      hasPdfUrl: !!this.pdfUrl,
      pdfFile: this.pdfFile,
      pdfUrl: this.pdfUrl
    });

    if (this.pdfFile && this.pdfUrl) {
      const uploadResult = {
        file: this.pdfFile,
        url: this.pdfUrl,
        fileName: this.pdfFile.name
      };

      console.log('📤 PDF Upload Modal - Emitindo upload:', uploadResult);
      this.upload.emit(uploadResult);
      this.resetForm();
    } else {
      console.error('❌ PDF Upload Modal - Condições não atendidas para upload');
    }
  }

  removePdf(): void {
    this.pdfFile = null;
    this.pdfUploaded = false;
    this.pdfUrl = '';
    this.errorMessage = '';
  }

  private resetForm(): void {
    this.pdfFile = null;
    this.pdfUploading = false;
    this.pdfUploaded = false;
    this.pdfUrl = '';
    this.errorMessage = '';
  }
}
