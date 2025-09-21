import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

/**
 * Intercepta as requisições HTTP para adicionar o token de autenticação JWT
 * no cabeçalho 'Authorization' para chamadas destinadas à API.
 * @param req A requisição HTTP a ser interceptada.
 * @param next O próximo manipulador na cadeia de interceptores.
 * @returns Um Observable do evento HTTP.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const token = localStorage.getItem('auth_token');
  const isApiUrl = req.url.startsWith(API_CONFIG.BASE_URL);

  if (token && isApiUrl) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', token),
    });
    return next(authReq);
  }

  return next(req);
};
