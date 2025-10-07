import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ButtonComponent } from '../../../../shared/components/ui';
import { BytesPipe } from '../../../../shared/pipes/bytes.pipe';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-transactions-preview',
  imports: [ButtonComponent, MatProgressBar, BytesPipe],
  templateUrl: './transactions-preview.html',
  styleUrl: './transactions-preview.scss',
})
export class TransactionsPreview implements OnInit {
  private readonly _transactionsService = inject(TransactionsService);
  private readonly _http = inject(HttpClient);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _dialogRef? = inject(MatDialogRef<TransactionsPreview>, { optional: true });
  public readonly data? = inject(MAT_DIALOG_DATA, { optional: true });
  private _loadingDownload = signal<boolean>(false);
  public loadingDownloadComplete = computed(() => this._loadingDownload() || this._transactionsService.loadingDownload());

  public name = signal<string>('');
  public size = signal<number>(0);
  public url = signal<SafeResourceUrl>('');
  // public urlSanitized = computed(() => this._sanitizer.bypassSecurityTrustResourceUrl(this.url()));

  get loading() {
    return this._transactionsService.loadingPreview;
  }

  public async ngOnInit(): Promise<void> {
    await this._transactionsService.getReceiptDetails(this.data?.transactionId).then((response) => {
      this.name.set(response.name);
      this.size.set(response.size);

      // Para desenvolvimento: se a URL for "#", criar um blob local para preview
      if (response.url === '#') {
        console.log('🔧 [DEV] Modo de desenvolvimento - Criando preview local');
        // Criar um PDF simples para demonstração
        this.createMockPdfPreview();
      } else {
        const sanitizedUrl = this._sanitizer.bypassSecurityTrustResourceUrl(
          `${response.url}#toolbar=0&navpanes=0`
        );
        this.url.set(sanitizedUrl);
      }
    });
  }

  private createMockPdfPreview() {
    // Criar um PDF simples em memória para demonstração
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Comprovante PDF - Modo Desenvolvimento) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000000419 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
518
%%EOF`;

    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const sanitizedUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
    this.url.set(sanitizedUrl);
  }

  public async download() {
    this._loadingDownload.set(true);
    try {
      // 1. Pega a URL de download segura do nosso backend
      const downloadUrl = await this._transactionsService
        .getReceiptDownloadUrl(this.data?.transactionId)
        .finally(() => {
          this._loadingDownload.set(false);
        });

      // 2. Abre a URL diretamente. O backend já configurou o S3 para forçar o download.
      // Isso é mais simples e eficiente do que baixar o blob via HttpClient.
      const link = document.createElement('a');
      link.href = downloadUrl;
      // O nome do arquivo já é definido pelo backend, mas podemos adicionar como fallback.
      link.download = this.name() || 'comprovante.pdf';
      link.click();
    } catch (error) {
      console.error('Falha ao obter a URL de download', error);
    }
  }

  public async deletePdf() {
    try {
      console.log('🗑️ Excluindo PDF da transação:', this.data?.transactionId);

      await this._transactionsService.removeReceipt(this.data?.transactionId);

      this._dialogRef?.close({ deleted: true });
    } catch (error) {
      console.error('Erro ao excluir PDF:', error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    }
  }

  public close() {
    this._dialogRef?.close();
  }
}
