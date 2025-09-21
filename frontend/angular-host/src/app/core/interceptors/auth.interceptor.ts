import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import {
  OAuthModuleConfig,
  OAuthResourceServerErrorHandler,
  OAuthStorage,
} from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MapsAuthInterceptor implements HttpInterceptor {
  constructor(
    private service: AuthService,
    private readonly oauthStorage: OAuthStorage,
    private readonly errorHandler: OAuthResourceServerErrorHandler,
    @Optional() private readonly moduleConfig: OAuthModuleConfig
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (this.service.config.auth.disabled)
    //   return next.handle(req).pipe(catchError((err) => this.errorHandler.handleError(err)));

    // const token = this.oauthStorage.getItem('access_token');
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IklzcmFlbCAyIiwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6InRlc3RlcyIsImlkIjoiNjhjZmZhZDE0NzczY2NmZjdjYzgzZjNjIiwiaWF0IjoxNzU4NDYzMjA5LCJleHAiOjE3NTg1MDY0MDl9.WbPsGXol0z_dpgYc1oK_bnhANxHbVis5f20_5aQRSqs';

    const allowedUrls = this.moduleConfig.resourceServer.allowedUrls;

    const authReq =
      allowedUrls?.map((url) => req.url.endsWith(url)).some((value) => value === true) ||
      token === null
        ? // token === 'null'
          req.clone({
            url: req.url,
          })
        : req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
            url: req.url,
          });

    return next.handle(authReq).pipe(catchError((err) => this.errorHandler.handleError(err)));
  }
}
