import { ApplicationRef, createComponent, EnvironmentInjector, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Confirmable } from './confirmable';
import { IConfirmable } from './confirmable.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService implements IConfirmable {
  private componentRef: any;

  constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector) {}

  confirm(message: string, title?: string): Observable<boolean> {
    const result = new Subject<boolean>();

    // Destrói qualquer modal anterior
    this.destroyModal();

    // Cria o componente do modal dinamicamente
    this.componentRef = createComponent(Confirmable, {
      environmentInjector: this.injector,
    });

    // Define as propriedades de entrada
    this.componentRef.setInput('isOpen', true);
    this.componentRef.setInput('title', title || 'Confirmar Ação');
    this.componentRef.setInput('message', message);

    // Inscreve-se nos eventos de saída
    const confirmSubscription = this.componentRef.instance.confirm.subscribe(() => {
      result.next(true);
      result.complete();
      this.destroyModal();
    });

    const cancelSubscription = this.componentRef.instance.cancel.subscribe(() => {
      result.next(false);
      result.complete();
      this.destroyModal();
    });

    // Adiciona o componente ao DOM
    this.appRef.attachView(this.componentRef.hostView);
    const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // Garante a limpeza quando o observable for cancelado
    result.subscribe({
      complete: () => {
        confirmSubscription.unsubscribe();
        cancelSubscription.unsubscribe();
      },
    });

    return result.asObservable();
  }

  private destroyModal(): void {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
