// src/app/shared/decorators/confirmable/confirmable.model.ts
import { Observable } from 'rxjs';

/**
 * Interface para o serviço de confirmação.
 * Componentes que usam o decorator @Confirmable devem prover um serviço
 * que implemente esta interface.
 */
export interface IConfirmable {
  confirm(message: string, title?: string): Observable<boolean>;
}
