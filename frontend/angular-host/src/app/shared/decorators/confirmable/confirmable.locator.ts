import { IConfirmable } from './confirmable.interface';

/**
 * Mantém uma referência estática para o serviço de confirmação,
 * permitindo que o decorator @Confirmable o acesse globalmente.
 */
export class ConfirmableLocator {
  static confirmationService: IConfirmable;
}
