import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryAutocompleteComponent } from '../../../../shared/components/category-autocomplete';
import { InputFile } from '../../../../shared/components/input-file/input-file';
import { ButtonComponent, InputComponent } from '../../../../shared/components/ui';
import { ITransactionType } from '../../../../shared/interfaces/transaction.interface';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-transactions-form',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, InputFile, CategoryAutocompleteComponent, CommonModule],
  templateUrl: './transactions-form.html',
  styleUrl: './transactions-form.scss',
})
export class TransactionsForm implements OnInit {
  private readonly _builder = inject(NonNullableFormBuilder);
  private readonly _transactionsService = inject(TransactionsService);
  private readonly _dialogRef? = inject(MatDialogRef<TransactionsForm>, { optional: true });

  public readonly data? = inject(MAT_DIALOG_DATA, { optional: true });
  public alignAction = input<'start' | 'center' | 'end'>('center');

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
      const { filePath, ...transactionData } = this.data.transaction;
      console.log(transactionData);

      this.form.patchValue({
        ...transactionData,
        comprovante: filePath || null,
      });
    }
  }

  onCategorySelected(category: string): void {
    console.log('Categoria selecionada:', category);
    // A categoria já é automaticamente definida pelo ControlValueAccessor
  }

  handleTransaction(transaction: any) {
    const formData = new FormData();

    // Adiciona todos os campos do formulário ao FormData
    for (const key in transaction) {
      if (transaction.hasOwnProperty(key)) {
        const value = transaction[key];
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else if (value !== null && value !== undefined) {
          // Converte o valor monetário para o formato correto
          if (key === 'valor') {
            // Converte de formato brasileiro (1.234,56) para decimal (1234.56)
            const numericValue = String(value).replace(/\./g, '').replace(',', '.');
            const decimalValue = parseFloat(numericValue);
            formData.append(key, String(decimalValue));
          } else {
            formData.append(key, String(value));
          }
        }
      }
    }

    if (this.data?.transaction?.id) {
      const id = this.data?.transaction?.id;
      this._transactionsService.update(id, formData).then(() => {
        this._dialogRef?.close(true);
      });
    } else {
      this._transactionsService.insert(formData).then(() => {
        this.form.reset();

        if (this._dialogRef) {
          this._dialogRef.close(true);
        }
      });
    }
  }

  cancel() {
    this._dialogRef?.close(false);
  }
}
