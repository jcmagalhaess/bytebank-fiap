import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticatedCheck()) {
    return true; // Usuário está logado, permite o acesso.
  }

  return router.parseUrl('/auth/login'); // Usuário não está logado, redireciona para o login.
};
