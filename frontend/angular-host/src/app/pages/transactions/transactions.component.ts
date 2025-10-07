import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { SearchIconComponent } from '../../shared/components/icons/search-icon.component';
import { SettingIconComponent } from '../../shared/components/icons/setting-icon.component';
import { EditTransactionModalComponent } from '../../shared/components/transaction/edit-transaction-modal/edit-transaction-modal.component';
import { PdfUploadModalComponent } from '../../shared/components/transaction/pdf-upload-modal/pdf-upload-modal.component';
import { PdfViewerModalComponent } from '../../shared/components/transaction/pdf-viewer-modal/pdf-viewer-modal.component';
import { TransactionFiltersComponent } from '../../shared/components/transaction/transaction-filters/transaction-filters.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { Transaction } from '../../shared/interfaces/transaction.interface';
import { formatToBRL } from '../../shared/utils/format';
import { TransactionsForm } from './components/transactions-form/transactions-form';
import { TransactionsTable } from './components/transactions-table/transactions-table';
import { TransactionsService } from './services/transactions.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TransactionFiltersComponent,
    ButtonComponent,
    SearchIconComponent,
    SettingIconComponent,
    TransactionsTable,
  ],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {
  private readonly _transactionsService = inject(TransactionsService);
  private readonly _dialog = inject(MatDialog);

  get transactions() {
    return this._transactionsService.transactionList;
  }

  get loading() {
    return this._transactionsService.loading;
  }

  // Signals para estado reativo
  // transactions = signal<Transaction[]>([]);
  filteredTransactions = signal<Transaction[]>([]);
  // loading = signal<boolean>(true);
  showFilters = signal<boolean>(false);
  showAddModal = signal<boolean>(false);
  editingTransaction = signal<Transaction | null>(null);
  deleteId = signal<number | null>(null);
  currentPage = signal<number>(1);
  searchTerm = signal<string>('');

  // Paginação
  itemsPerPage = 10;

  // PDF viewer
  showPdfModal = signal<boolean>(false);
  viewingPdf = signal<Transaction | null>(null);

  // PDF upload
  showPdfUploadModal = signal<boolean>(false);
  uploadingToTransaction = signal<Transaction | null>(null);

  // Filtros
  filters = signal({
    type: 'all' as 'all' | 'credit' | 'debit',
    startDate: '',
    endDate: '',
    category: '',
    minValue: '',
    maxValue: '',
    search: '',
  });

  // Computed para saldo total
  // balance = computed(() => {
  //   const transactions = this.transactions();
  //   return transactions.reduce((acc, t) => {
  //     if (t.type === 'credit') return acc + t.amount;
  //     if (t.type === 'debit') return acc - t.amount;
  //     return acc;
  //   }, 0);
  // });

  // Computed para categorias disponíveis
  availableCategories = computed(() => {
    const transactions = this.transactions()?.data || [];
    return [...new Set(transactions.map((t: any) => t.categoria).filter(Boolean))] as string[];
  });

  // Computed para verificar se há filtros ativos
  hasActiveFilters = computed(() => {
    const f = this.filters();
    return (
      f.type !== 'all' ||
      f.startDate !== '' ||
      f.endDate !== '' ||
      f.category !== '' ||
      f.minValue !== '' ||
      f.maxValue !== '' ||
      f.search !== ''
    );
  });

  // Computed para paginação
  totalPages = computed(() => Math.ceil(this.filteredTransactions().length / this.itemsPerPage));

  startIndex = computed(() => (this.currentPage() - 1) * this.itemsPerPage);

  endIndex = computed(() => this.startIndex() + this.itemsPerPage);

  currentTransactions = computed(() => {
    const start = this.startIndex();
    const end = this.endIndex();
    return this.filteredTransactions().slice(start, end);
  });

  async ngOnInit(): Promise<void> {
    await this._transactionsService.list();
  }

  applyFilters() {
    const transactions = this.transactions();
    const f = this.filters();

    // let filtered = transactions.filter((transaction) => {
    //   // Filtro por tipo
    //   if (f.type !== 'all' && transaction.type !== f.type) return false;

    //   // Filtro por categoria
    //   if (f.category && transaction.categoria !== f.category) return false;

    //   // Filtro por busca
    //   if (f.search) {
    //     const searchLower = f.search.toLowerCase();
    //     const matchesSearch =
    //       transaction.descricao?.toLowerCase().includes(searchLower) ||
    //       transaction.categoria?.toLowerCase().includes(searchLower);
    //     if (!matchesSearch) return false;
    //   }

    //   // Filtro por data
    //   if (f.startDate) {
    //     const transactionDate = new Date(transaction.date);
    //     const startDate = new Date(f.startDate);
    //     if (transactionDate < startDate) return false;
    //   }

    //   if (f.endDate) {
    //     const transactionDate = new Date(transaction.date);
    //     const endDate = new Date(f.endDate);
    //     if (transactionDate > endDate) return false;
    //   }

    //   // Filtro por valor
    //   if (f.minValue) {
    //     const minValue = parseFloat(f.minValue);
    //     if (transaction.amount < minValue) return false;
    //   }

    //   if (f.maxValue) {
    //     const maxValue = parseFloat(f.maxValue);
    //     if (transaction.amount > maxValue) return false;
    //   }

    //   return true;
    // });

    // this.filteredTransactions.set(filtered);
    this.currentPage.set(1); // Reset para primeira página
  }

  onFiltersChange(newFilters: any) {
    const newObj: any = {};

    newObj.tipo =
      newFilters.type === 'all' ? null : newFilters.type === 'deposit' ? 'credit' : 'debit';
    newObj.categoria = newFilters.category;
    // newObj.descricao = newFilters.search;
    newObj.dataInicio = newFilters.startDate;
    newObj.dataFim = newFilters.endDate;
    newObj.valorMin = newFilters.minValue;
    newObj.valorMax = newFilters.maxValue;

    this._transactionsService.list(newObj);

    console.log('🔍 Filtros atualizados:', newFilters);

    this.filters.set(newFilters);
    this.applyFilters();
  }

  onClearFilters() {
    this._transactionsService.list({});
    this.filters.set({
      type: 'all',
      startDate: '',
      endDate: '',
      category: '',
      minValue: '',
      maxValue: '',
      search: '',
    });
    this.applyFilters();
  }

  onPageChange(page: number) {
    this._transactionsService.list({ page });
    // Scroll para o topo da lista
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSearchChange(param: string, searchTerm: string) {
    this._transactionsService.list({ [param]: searchTerm });
    // this.filters.update((f) => ({ ...f, search: searchTerm }));
    // this.applyFilters();
  }

  toggleFilters() {
    this.showFilters.update((show) => !show);
  }

  onAddTransaction() {
    this.showAddModal.set(true);
  }

  onEditTransaction(transaction: Transaction) {
    this.editingTransaction.set(transaction);
  }

  onDeleteTransaction(id: number) {
    this.deleteId.set(id);
  }

  // confirmDelete() {
  //   const id = this.deleteId();
  //   if (id) {
  //     this.transactionService.delete(id).subscribe({
  //       next: () => {
  //         this.deleteId.set(null);
  //         this._transactionsService.list(); // Recarrega a lista através do serviço
  //       },
  //       error: (error) => {
  //         console.error('Erro ao deletar transação:', error);
  //       },
  //     });
  //   }
  // }

  cancelDelete() {
    this.deleteId.set(null);
  }

  // onSaveTransaction(transactionData: any) {
  //   console.log('💾 Salvando transação:', transactionData);

  //   // Verificar se há um PDF sendo carregado
  //   if (this.showPdfUploadModal()) {
  //     console.log('⚠️ Tentativa de salvar durante upload de PDF - bloqueando');
  //     alert('Aguarde o carregamento do PDF ser concluído antes de salvar.');
  //     return;
  //   }

  //   if (transactionData.id) {
  //     // Editar transação existente
  //     this.transactionService.update(transactionData.id, transactionData).subscribe({
  //       next: () => {
  //         console.log('✅ Transação editada com sucesso');
  //         this.editingTransaction.set(null);
  //         this._transactionsService.list(); // Recarrega a lista através do serviço
  //       },
  //       error: (error) => {
  //         console.error('❌ Erro ao editar transação:', error);
  //         alert('Erro ao editar transação. Verifique sua conexão.');
  //       },
  //     });
  //   } else {
  //     // Adicionar nova transação
  //     this.transactionService
  //       .add({
  //         ...transactionData,
  //         date: new Date().toISOString().split('T')[0],
  //       })
  //       .subscribe({
  //         next: (newTransaction) => {
  //           console.log('✅ Transação criada com sucesso:', newTransaction);
  //           this.showAddModal.set(false);
  //           this._transactionsService.list(); // Recarrega a lista através do serviço
  //         },
  //         error: (error) => {
  //           console.error('❌ Erro ao criar transação:', error);
  //           alert('Erro ao criar transação. Verifique sua conexão.');
  //         },
  //       });
  //   }
  // }

  onCloseModal() {
    this.editingTransaction.set(null);
    this.showAddModal.set(false);
  }

  onViewPdf(transaction: Transaction) {
    console.log('👁️ Transactions - onViewPdf chamado:', {
      transaction: transaction,
      pdfUrl: transaction.pdfUrl,
      pdfFileName: transaction.pdfFileName,
    });

    if (transaction.pdfUrl) {
      console.log('✅ Transactions - Abrindo modal de visualização');
      this.viewingPdf.set(transaction);
      this.showPdfModal.set(true);
    } else {
      console.log('❌ Transactions - Transação não possui PDF');
    }
  }

  onPdfUpload(transaction: Transaction) {
    this.uploadingToTransaction.set(transaction);
    this.showPdfUploadModal.set(true);
  }

  onClosePdfModal() {
    this.showPdfModal.set(false);
    this.viewingPdf.set(null);
  }

  onClosePdfUploadModal() {
    this.showPdfUploadModal.set(false);
    this.uploadingToTransaction.set(null);
  }

  // onPdfUploaded(uploadResult: PdfUploadResult) {
  //   console.log('📎 Transactions - onPdfUploaded recebido:', uploadResult);

  //   const transaction = this.uploadingToTransaction();
  //   console.log('📎 Transactions - Transação atual:', transaction);

  //   if (transaction?.id) {
  //     console.log('📎 Anexando PDF à transação:', transaction.id);

  //     // Atualizar a transação com o PDF
  //     const updatedTransaction = {
  //       ...transaction,
  //       pdfUrl: uploadResult.url,
  //       pdfFileName: uploadResult.fileName,
  //     };

  //     console.log('📎 Transactions - Transação atualizada:', updatedTransaction);

  //     // Atualizar no serviço
  //     this.transactionService.update(transaction.id, updatedTransaction).subscribe({
  //       next: () => {
  //         console.log('✅ PDF anexado com sucesso');
  //         this.onClosePdfUploadModal();
  //         this._transactionsService.list(); // Recarregar a lista
  //       },
  //       error: (error) => {
  //         console.error('❌ Erro ao anexar PDF:', error);
  //         alert('Erro ao anexar PDF. Tente novamente.');
  //       },
  //     });
  //   } else {
  //     console.error('❌ Transactions - Nenhuma transação encontrada para anexar PDF');
  //   }
  // }

  onDownloadPdf() {
    const pdf = this.viewingPdf();
    if (pdf?.pdfUrl) {
      // Criar um link temporário para download
      const link = document.createElement('a');
      link.href = pdf.pdfUrl;
      link.download = pdf.pdfFileName || 'comprovante.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // onDeletePdf() {
  //   const pdf = this.viewingPdf();
  //   if (pdf?.id) {
  //     console.log('🗑️ Removendo PDF da transação:', pdf.id);

  //     // Atualizar a transação removendo o PDF
  //     const updatedTransaction = {
  //       ...pdf,
  //       pdfUrl: undefined,
  //       pdfFileName: undefined,
  //     };

  //     // Atualizar no serviço
  //     this.transactionService.update(pdf.id, updatedTransaction).subscribe({
  //       next: () => {
  //         console.log('✅ PDF removido com sucesso');
  //         this.onClosePdfModal();
  //         this._transactionsService.list(); // Recarregar a lista
  //       },
  //       error: (error) => {
  //         console.error('❌ Erro ao remover PDF:', error);
  //         alert('Erro ao remover PDF. Tente novamente.');
  //       },
  //     });
  //   }
  // }

  formatToBRL = formatToBRL;

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  deleteTransaction = (id: number) => this._transactionsService.delete(id);

  openModal(transaction?: any) {
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

  openModalUpload(transaction: any) {
    const dialogRef = this._dialog.open(PdfUploadModalComponent, {
      width: '40vw',
      data: { transaction },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._transactionsService.list();
      }
    });
  }
}
