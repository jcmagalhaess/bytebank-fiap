import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const pdfjsLib: any;

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class PdfViewerComponent implements OnChanges, AfterViewInit {
  @Input() pdfUrl: string = '';
  @Input() fileName: string = '';

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container', { static: false }) container!: ElementRef<HTMLDivElement>;

  currentPage: number = 1;
  totalPages: number = 0;
  pdfDocument: any = null;
  loading: boolean = false;
  error: string = '';

  ngAfterViewInit() {
    // Aguardar um tick para garantir que o canvas esteja disponível
    setTimeout(() => {
      this.loadPdf();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('🔍 PDF Viewer - ngOnChanges:', {
      pdfUrl: this.pdfUrl,
      changes: changes
    });

    // Log adicional para debug
    if (changes['pdfUrl']) {
      console.log('📄 PDF Viewer - pdfUrl mudou:', {
        oldValue: changes['pdfUrl'].previousValue,
        newValue: changes['pdfUrl'].currentValue,
        hasValue: !!changes['pdfUrl'].currentValue
      });
    }

    if (changes['pdfUrl'] && this.pdfUrl) {
      console.log('🔄 PDF Viewer - Iniciando carregamento do PDF');
      this.loadPdf();
    } else if (changes['pdfUrl'] && !this.pdfUrl) {
      console.log('❌ PDF Viewer - pdfUrl está vazio');
    }
  }

  async loadPdf() {
    console.log('🔍 PDF Viewer - loadPdf chamado:', {
      pdfUrl: this.pdfUrl,
      hasCanvas: !!this.canvas
    });

    if (!this.pdfUrl || !this.canvas) {
      console.log('❌ PDF Viewer - Condições não atendidas:', {
        hasPdfUrl: !!this.pdfUrl,
        hasCanvas: !!this.canvas
      });
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      console.log('📚 PDF Viewer - Carregando PDF.js...');
      // Configurar PDF.js
      if (typeof pdfjsLib === 'undefined') {
        // Carregar PDF.js dinamicamente
        await this.loadPdfJs();
      }

      console.log('📄 PDF Viewer - Carregando documento PDF:', this.pdfUrl);
      // Carregar o PDF
      const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
      this.pdfDocument = await loadingTask.promise;
      this.totalPages = this.pdfDocument.numPages;
      this.currentPage = 1;

      console.log('✅ PDF Viewer - PDF carregado com sucesso:', {
        totalPages: this.totalPages
      });

      await this.renderPage(1);
    } catch (error) {
      console.error('❌ PDF Viewer - Erro ao carregar PDF:', error);
      this.error = 'Erro ao carregar o PDF. Verifique se o arquivo é válido.';
    } finally {
      this.loading = false;
    }
  }

  private async loadPdfJs() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(true);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async renderPage(pageNumber: number) {
    if (!this.pdfDocument || !this.canvas) return;

    try {
      const page = await this.pdfDocument.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = this.canvas.nativeElement;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Erro ao renderizar página:', error);
      this.error = 'Erro ao renderizar a página do PDF.';
    }
  }

  async previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      await this.renderPage(this.currentPage);
    }
  }

  async nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      await this.renderPage(this.currentPage);
    }
  }

  async goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      await this.renderPage(this.currentPage);
    }
  }
}
