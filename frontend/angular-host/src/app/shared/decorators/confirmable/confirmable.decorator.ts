import { firstValueFrom } from 'rxjs';
import { IConfirmable } from './confirmable.interface';
import { ConfirmableLocator } from './confirmable.locator';
/**
 * Decorator de Método que pede confirmação ao usuário antes de executar o método original.
 * Utiliza um serviço de confirmação (que deve ser injetado no componente como `confirmationService`).
 * Se o usuário cancelar, o método não é executado.
 *
 * @param message A mensagem de confirmação a ser exibida.
 * @returns Um MethodDecorator.
 *
 * @example
 * class MinhaClasse {
 *   @Confirm("Tem certeza que deseja excluir este item?")
 *   deleteItem(id: string) {
 *     console.log(`Item ${id} excluído.`);
 *   }
 * }
 */
export function Confirmable(message: string, title?: string) {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    // 1. Guarda uma referência ao método original
    const originalMethod = descriptor.value;

    // 2. Sobrescreve o método original com uma nova função assíncrona
    descriptor.value = async function (...args: any[]) {
      const confirmationService = ConfirmableLocator.confirmationService as IConfirmable;

      if (!confirmationService || typeof confirmationService.confirm !== 'function') {
        console.error(
          'ConfirmationService não foi localizado. Verifique a configuração no app.config.ts.'
        );
        // Como fallback, podemos usar o window.confirm ou simplesmente falhar.
        // Vamos usar o window.confirm para não quebrar a funcionalidade.
        if (!window.confirm(message)) return null;
      } else {
        // 4. Usa o serviço para exibir o diálogo e espera a resposta
        const allow = await firstValueFrom(confirmationService.confirm(message, title));
        if (!allow) return null;
      }

      // 5. Se confirmado, chama o método original
      const result = originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
  };
}
