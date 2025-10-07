import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToastMessage } from '../transaction';
import { PdfUploadLoaderComponent } from '../ui';

@Component({
  selector: 'app-input-file',
  imports: [PdfUploadLoaderComponent],
  templateUrl: './input-file.html',
  styleUrl: './input-file.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFile),
      multi: true,
    },
  ],
})
export class InputFile implements ControlValueAccessor {
  public label = input<string>();
  // Estados do PDF
  pdfFile: File | null = null;
  pdfUploading: boolean = false;
  pdfUploaded: boolean = false;
  pdfUrl: string = '';
  showPdfModal: boolean = false;
  toastMessage: ToastMessage | null = null;

  private onChange = (value: File) => {};
  private onTouched = () => {};

  // ControlValueAccessor methods
  writeValue(value: string): void {
    if (!value) this.removePdf();

    console.log('🔍 InputFile - writeValue:', value);
    this.pdfFile = {
      name: value,
      size: 0,
    } as File;

    this.pdfUploading = false;
    this.pdfUploaded = true;
    this.pdfUrl = value;
  }

  registerOnChange(fn: (value: File) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onPdfChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.handlePdfUpload(file);
    }
  }

  async handlePdfUpload(file: File): Promise<void> {
    // Validação do tipo de arquivo
    if (file.type !== 'application/pdf') {
      this.showToast('error', 'Apenas arquivos PDF são permitidos');
      return;
    }

    // Validação do tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('error', 'O arquivo deve ter no máximo 5MB');
      return;
    }

    this.pdfUploading = true;
    this.pdfFile = file;

    try {
      // Simular upload (substitua pela sua lógica de upload real)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      this.onChange(file);

      // Simular URL do arquivo (substitua pela URL real do seu servidor)
      const mockUrl = URL.createObjectURL(file);
      this.pdfUrl = mockUrl;
      this.pdfUploaded = true;
      this.showToast('success', 'Comprovante carregado com sucesso!');
    } catch (error) {
      this.showToast('error', 'Erro ao carregar o comprovante. Tente novamente.');
      this.pdfFile = null;
    } finally {
      this.pdfUploading = false;
    }
  }

  removePdf(): void {
    this.pdfFile = null;
    this.pdfUploaded = false;
    this.pdfUrl = '';

    this.onChange('' as any); // Envia uma string vazia para indicar remoção
  }

  cancelPdfUpload(): void {
    console.log('🚫 Cancelando upload de PDF');
    this.pdfUploading = false;
    this.pdfFile = null;
    this.pdfUploaded = false;
    this.pdfUrl = '';
    this.showToast('info', 'Upload de PDF cancelado.');
  }

  onPdfClick(): void {
    const currentPdfUrl = this.pdfUrl;
    const currentPdfFileName = this.pdfFile?.name;

    if (currentPdfUrl && currentPdfFileName) {
      this.showPdfModal = true;
    }
  }

  onPdfDownload(): void {
    const currentPdfUrl = this.pdfUrl;
    const currentPdfFileName = this.pdfFile?.name;

    if (currentPdfUrl) {
      const link = document.createElement('a');
      link.href = currentPdfUrl;
      link.download = currentPdfFileName || 'comprovante.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  onPdfDelete(): void {
    this.removePdf();
    this.showPdfModal = false;
  }

  showToast(type: 'success' | 'error' | 'info', message: string): void {
    this.toastMessage = { type, message };
    setTimeout(() => (this.toastMessage = null), 3000);
  }
}
