import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login, Register, TokenResponse } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  public readonly user = signal<UserResponse | null>(null);

  public login(loginData: Login): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>(`${environment.apiUrl}/auth/login`, loginData).pipe(
      tap((tokenResponse: TokenResponse) => {
        this.setTokens(tokenResponse);

        return tokenResponse;
      }),
    );
  }

  public register(registerData: Register): Observable<TokenResponse> {
    return this.httpClient
      .post<TokenResponse>(`${environment.apiUrl}/auth/register`, registerData)
      .pipe(
        tap((tokenResponse: TokenResponse) => {
          this.setTokens(tokenResponse);

          return tokenResponse;
        }),
      );
  }

  public getUserData(): Observable<UserResponse> {
    return this.httpClient
      .get<UserResponse>(`${environment.apiUrl}/user`)
      .pipe(tap((user) => this.user.set(user)));
  }

  public logout(): void {
    this.clearTokens();
    this.router.navigate(['/login']);
  }

  public setTokens(tokenResponse: TokenResponse): void {
    this.user.set(tokenResponse.user);
    localStorage.setItem('loginToken', tokenResponse.access_token);
    localStorage.setItem('email', tokenResponse.user.email);
    localStorage.setItem('userId', tokenResponse.user.id);
  }

  public getToken(): string | null {
    return localStorage.getItem('loginToken');
  }

  public clearTokens(): void {
    this.user.set(null);
    localStorage.removeItem('loginToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
  }
}
