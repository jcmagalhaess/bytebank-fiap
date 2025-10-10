import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideNgxMask } from 'ngx-mask';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { ApiService } from './core/services/api.service';
import { AuthService } from './core/services/auth.service';
import { ConfirmationService } from './shared/decorators/confirmable/confirmable.service';

registerLocaleData(localePt);

function initializeConfirmable() {
  const confirmationService = inject(ConfirmationService);
  return () => {
    // Importa o locator dinamicamente para evitar dependência cíclica
    import('./shared/decorators/confirmable/confirmable.locator').then(
      (locator) => (locator.ConfirmableLocator.confirmationService = confirmationService)
    );
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNgxMask(),
    AuthService,
    ApiService,
    ConfirmationService,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeConfirmable,
      multi: true,
    },
  ],
};
