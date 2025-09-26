import { Component, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-pdf-viewer-modal',
  templateUrl: './pdf-viewer-modal.component.html',
  standalone: true,
  imports: [CommonModule, ButtonComponent]
})
export class PdfViewerModalComponent implements OnChanges, AfterViewInit {
  @Input() isOpen: boolean = false;
  @Input() pdfUrl: string = '';
  @Input() fileName: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();

  @ViewChild('pdfIframe') pdfIframe!: ElementRef<HTMLIFrameElement>;

  ngAfterViewInit() {
    // Aguardar um tick para garantir que o iframe esteja disponível
    setTimeout(() => {
      this.updateIframeSrc();
    }, 0);
  }

  ngOnChanges(changes: any) {
    console.log('🔍 PDF Viewer Modal - ngOnChanges:', {
      isOpen: this.isOpen,
      pdfUrl: this.pdfUrl,
      fileName: this.fileName,
      changes: changes
    });

    if (changes['pdfUrl'] && this.pdfUrl) {
      this.updateIframeSrc();
    }
  }

  updateIframeSrc() {
    if (this.pdfIframe && this.pdfUrl) {
      console.log('🔧 PDF Viewer Modal - Atualizando src do iframe:', this.pdfUrl);
      this.pdfIframe.nativeElement.src = this.pdfUrl;
    }
  }


  onClose(): void {
    this.close.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }

  onDownload(): void {
    this.download.emit();
  }

  onIframeLoad(event: any): void {
    console.log('✅ PDF Viewer Modal - Iframe carregado:', {
      src: this.pdfUrl,
      iframe: event.target
    });
  }

  onIframeError(event: any): void {
    console.error('❌ PDF Viewer Modal - Erro no iframe:', {
      src: this.pdfUrl,
      error: event
    });
  }


}

