import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.addAccessTokenToRequest(request, next);
  }

  private addAccessTokenToRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const accessToken = localStorage.getItem('loginToken');

    if (!accessToken) {
      return next.handle(request);
    }

    const authHeader = `Bearer ${accessToken}`;
    const requestWithAuthHeader = request.clone({ setHeaders: { Authorization: authHeader } });

    return next.handle(requestWithAuthHeader);
  }
}
