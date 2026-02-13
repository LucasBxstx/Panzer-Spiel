import { CanActivate, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  private readonly router = inject(Router);

  public canActivate(): boolean {
    const token = localStorage.getItem('loginToken');

    if (token === null) {
      this.router.navigate(['/login']);
    }

    return token !== null;
  }
}
