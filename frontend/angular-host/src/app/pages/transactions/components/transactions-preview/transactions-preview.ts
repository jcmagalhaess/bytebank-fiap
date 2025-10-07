import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
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
  public readonly _sanitizer = inject(DomSanitizer);
  private readonly _dialogRef? = inject(MatDialogRef<TransactionsPreview>, { optional: true });
  public readonly data? = inject(MAT_DIALOG_DATA, { optional: true });

  public name = signal<string>('');
  public size = signal<number>(0);
  public url = signal<string>('');
  public urlSanitized = computed(() => this._sanitizer.bypassSecurityTrustResourceUrl(this.url()));

  get loading() {
    return this._transactionsService.loadingPreview;
  }

  public async ngOnInit(): Promise<void> {
    await this._transactionsService.getReceiptDetails(this.data?.transactionId).then((response) => {
      this.name.set(response.name);
      this.size.set(response.size);
      this.url.set(`${response.url}#toolbar=0&navpanes=0`);
    });
  }

  public async download() {
    await this._transactionsService.getReceiptDownloadUrl(this.data?.transactionId);
  }

  public close() {
    this._dialogRef?.close();
  }
}
