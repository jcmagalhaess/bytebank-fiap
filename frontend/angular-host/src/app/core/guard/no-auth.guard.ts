import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticatedCheck()) {
    // Se o usuário já está autenticado, redireciona para o dashboard
    return router.createUrlTree(['/dashboard']);
  }

  return true; // Permite o acesso se não estiver autenticado
};
