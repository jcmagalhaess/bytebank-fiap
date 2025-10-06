import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TransactionRowComponent } from '../../../../shared/components/transaction';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component';

@Component({
  selector: 'app-transactions-table',
  imports: [TransactionRowComponent, DatePipe, CurrencyPipe, PaginationComponent],
  templateUrl: './transactions-table.html',
  styleUrl: './transactions-table.scss',
})
export class TransactionsTable {
  public list = input.required<any>();
  public loading = input.required<boolean>();

  public onEditTransaction(item: any) {}
  public onDeleteTransaction(id: number) {}
  public onViewPdf(filePath: string) {}
  public onPdfUpload(filePath: string) {}
  public onPageChange(page: number) {}
}
