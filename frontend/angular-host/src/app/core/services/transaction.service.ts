import { Injectable } from '@angular/core';
import { Observable, map, switchMap, of, throwError } from 'rxjs';
import { Transaction, TransactionFormData } from '../../shared/interfaces/transaction.interface';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  // Mock data para teste sem autenticação
  private mockTransactions: Transaction[] = [
    {
      id: 1,
      type: 'deposit',
      amount: 1500.00,
      date: '2024-01-15',
      categoria: 'Salário',
      descricao: 'Salário mensal',
    },
    {
      id: 2,
      type: 'transfer',
      amount: -200.00,
      date: '2024-01-14',
      categoria: 'Compras',
      descricao: 'Supermercado',
    },
    {
      id: 3,
      type: 'deposit',
      amount: 500.00,
      date: '2024-01-13',
      categoria: 'Freelance',
      descricao: 'Projeto web',
    }
  ];

  constructor(private api: ApiService) {}

  // GET /account → { account, transactions, cards }
  list(): Observable<Transaction[]> {
    // Forçar uso de dados mock para desenvolvimento
    console.log('🔧 Usando dados mock (desenvolvimento)');
    console.log('📊 Retornando transações mock:', this.mockTransactions.length);
    console.log('📋 Lista mock:', this.mockTransactions);
    return of(this.mockTransactions);

    return this.api.get<any>('/account').pipe(
      map((res) => {
        const transactions = res?.transactions || res?.result?.transactions || [];
        return transactions.map((t: any) => ({
          id: t.id,
          type: t.type === 'transfer' ? 'transfer' : 'deposit',
          amount: Number(t.value) || 0,
          date: t.date ? new Date(t.date).toISOString().split('T')[0] : '',
          categoria: t.to || '',
          descricao: t.from || '',
          pdfUrl: t.anexo || undefined,
        }) as Transaction);
      })
    );
  }

  // POST /account/transaction
  add(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    // Forçar uso de dados mock para desenvolvimento
    console.log('🔧 Simulando criação de transação (desenvolvimento)');
    console.log('📝 Dados da transação:', transaction);
    const newTransaction: Transaction = {
      id: Date.now(), // ID temporário
      ...transaction,
      date: transaction.date || new Date().toISOString().split('T')[0]
    };
    this.mockTransactions.push(newTransaction);
    console.log('📊 Total de transações mock:', this.mockTransactions.length);
    console.log('📋 Lista atual:', this.mockTransactions);
    return of(newTransaction);

    return this.api.get<any>('/account').pipe(
      map((res) => (res?.account || res?.result?.account || [])[0]?.id),
      switchMap((accountId: string) => {
        const payload = {
          accountId,
          value: transaction.amount,
          type: transaction.type,
          from: transaction.descricao || '',
          to: transaction.categoria || '',
          anexo: transaction.pdfUrl || '',
        };
        return this.api.post<any>('/account/transaction', payload).pipe(
          map((created) => {
            const t = created?.result || created;
            return {
              id: t?.id,
              type: t?.type || transaction.type,
              amount: Number(t?.value ?? transaction.amount),
              date: t?.date ? new Date(t.date).toISOString().split('T')[0] : transaction.date,
              categoria: t?.to ?? transaction.categoria,
              descricao: t?.from ?? transaction.descricao,
              pdfUrl: t?.anexo ?? transaction.pdfUrl,
            } as Transaction;
          })
        );
      })
    );
  }

  // Backend atual não expõe update/delete específicos por ID de transação; implementação temporária com mock
  update(id: number, transaction: Partial<TransactionFormData>): Observable<Transaction> {
    console.log('🔧 Usando dados mock para update (desenvolvimento)');

    // Simular delay da API
    return new Observable(observer => {
      setTimeout(() => {
        // Encontrar a transação no mock data
        const index = this.mockTransactions.findIndex(t => t.id === id);
        if (index !== -1) {
          // Atualizar a transação no mock
          this.mockTransactions[index] = {
            ...this.mockTransactions[index],
            ...transaction,
            id: id
          } as Transaction;

          console.log('✅ Transação atualizada no mock:', this.mockTransactions[index]);
          observer.next(this.mockTransactions[index]);
          observer.complete();
        } else {
          console.error('❌ Transação não encontrada para update:', id);
          observer.error(new Error('Transação não encontrada'));
        }
      }, 500); // Simular delay da API
    });
  }

  delete(id: number): Observable<void> {
    console.log('🔧 Usando dados mock para delete (desenvolvimento)');

    // Simular delay da API
    return new Observable(observer => {
      setTimeout(() => {
        // Encontrar e remover a transação do mock data
        const index = this.mockTransactions.findIndex(t => t.id === id);
        if (index !== -1) {
          this.mockTransactions.splice(index, 1);
          console.log('✅ Transação removida do mock:', id);
          observer.next();
          observer.complete();
        } else {
          console.error('❌ Transação não encontrada para delete:', id);
          observer.error(new Error('Transação não encontrada'));
        }
      }, 500); // Simular delay da API
    });
  }

  deletePdf(_id: number): Observable<void> {
    throw new Error('Delete de comprovante não suportado pela API atual');
  }
}
