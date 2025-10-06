import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';
import { TransactionsForm } from '../transactions-form/transactions-form';
import { TransactionsTable } from '../transactions-table/transactions-table';

@Component({
  selector: 'app-transactions-widget',
  imports: [TransactionsForm, TransactionsTable, RouterLink],
  templateUrl: './transactions-widget.html',
  styleUrl: './transactions-widget.scss',
})
export class TransactionsWidget implements OnInit {
  private readonly _transactionsService = inject(TransactionsService);
  private readonly _dialog = inject(MatDialog);

  get transactions() {
    return this._transactionsService.transactionList;
  }

  get loading() {
    return this._transactionsService.loading;
  }

  async ngOnInit(): Promise<void> {
    await this._transactionsService.list({ pageSize: 6 });
  }

  deleteTransaction = (id: number) => this._transactionsService.delete(id);

  openModal(transaction: any) {
    const dialogRef = this._dialog.open(TransactionsForm, {
      width: '40vw',
      data: { transaction },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Logic to handle editing/saving, maybe refresh the list
        this._transactionsService.list();
      }
    });
  }
}
