import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/ui';
import { ITransactionType } from '../../../../shared/interfaces/transaction.interface';
import { TransactionsService } from '../../services/transactions.service';
import { TransactionsTable } from '../transactions-table/transactions-table';
import { InputComponent } from './../../../../shared/components/ui/input/input.component';

@Component({
  selector: 'app-transactions-widget',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, TransactionsTable, RouterLink],
  templateUrl: './transactions-widget.html',
  styleUrl: './transactions-widget.scss',
})
export class TransactionsWidget implements OnInit {
  private readonly _builder = inject(NonNullableFormBuilder);
  private readonly _transactionsService = inject(TransactionsService);

  public form = this._builder.group({
    categoria: this._builder.control<string | null>('', Validators.required),
    tipoTransacao: this._builder.control<ITransactionType>('credit'),
    valor: this._builder.control<number>(0, [Validators.required, Validators.min(0.01)]),
    descricao: this._builder.control<string>(''),
  });
  public transactionOptions = [
    { label: 'Receita', value: 'credit', bold: true },
    { label: 'Despesa', value: 'debit', bold: true },
  ];

  get transactions() {
    return this._transactionsService.transactionList;
  }

  get loading() {
    return this._transactionsService.loading;
  }

  async ngOnInit(): Promise<void> {
    await this._transactionsService.list();
  }

  addTransaction(transaction: any) {
    this._transactionsService.insert(transaction).then(() => {
      this.form.reset();
    });
  }
}
