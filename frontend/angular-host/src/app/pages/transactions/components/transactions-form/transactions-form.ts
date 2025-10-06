import { Component, computed, inject, OnInit, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InputFile } from '../../../../shared/components/input-file/input-file';
import { ButtonComponent, InputComponent } from '../../../../shared/components/ui';
import { ITransactionType } from '../../../../shared/interfaces/transaction.interface';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-transactions-form',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, InputFile],
  templateUrl: './transactions-form.html',
  styleUrl: './transactions-form.scss',
})
export class TransactionsForm implements OnInit {
  private readonly _builder = inject(NonNullableFormBuilder);
  private readonly _transactionsService = inject(TransactionsService);
  private readonly _dialogRef? = inject(MatDialogRef<TransactionsForm>, { optional: true });
  public readonly data? = inject(MAT_DIALOG_DATA, { optional: true });

  public loading = computed(
    () => this._transactionsService.loadingCreate() || this._transactionsService.loadingUpdate()
  );

  public edit = output<any>();

  public form = this._builder.group({
    categoria: this._builder.control<string | null>('', Validators.required),
    tipoTransacao: this._builder.control<ITransactionType>('credit'),
    valor: this._builder.control<number>(0, [Validators.required, Validators.min(0.01)]),
    descricao: this._builder.control<string>(''),
    comprovante: this._builder.control<File | null>(null),
  });
  public transactionOptions = [
    { label: 'Receita', value: 'credit', bold: true },
    { label: 'Despesa', value: 'debit', bold: true },
  ];

  ngOnInit(): void {
    if (this.data?.transaction) {
      this.form.patchValue(this.data.transaction);
    }
  }

  handleTransaction(transaction: any) {
    if (this._dialogRef) {
      const id = this.data?.transaction?.id;
      this._transactionsService.update(id, transaction).then(() => {
        this._dialogRef?.close(true);
      });
    } else {
      this._transactionsService.insert(transaction).then(() => {
        this.form.reset();
      });
    }
  }

  cancel() {
    this._dialogRef?.close(false);
  }
}
