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
      const sanitizedUrl = this._sanitizer.bypassSecurityTrustResourceUrl(
        `${response.url}#toolbar=0&navpanes=0`
      );
      this.url.set(sanitizedUrl);
    });
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

  public close() {
    this._dialogRef?.close();
  }
}
