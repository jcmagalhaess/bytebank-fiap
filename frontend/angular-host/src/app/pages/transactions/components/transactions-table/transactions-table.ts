import { CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TransactionRowComponent } from '../../../../shared/components/transaction';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component';
@Component({
  selector: 'app-transactions-table',
  imports: [
    TransactionRowComponent,
    DatePipe,
    CurrencyPipe,
    PaginationComponent,
     MatProgressBar,
  ],
  templateUrl: './transactions-table.html',
  styleUrl: './transactions-table.scss',
})
export class TransactionsTable {
  public list = input.required<any>();
  public loading = input.required<boolean>();
  public pagination = input<boolean>(false);

  public delete = output<number>();
  public edit = output<any>();
  public pdfView = output<number>();
  public pdfUpload = output<any>();
  public pdfDelete = output();
  public pageChange = output<number>();

  public onEditTransaction(item: any) {}
  public onDeleteTransaction(id: number) {}
  public onViewPdf(filePath: string) {}
  public onPdfUpload(filePath: string) {}
  public onPageChange(page: number) {
    console.log('👁️ Transactions - onPageChange chamado:', page);
  }
}
