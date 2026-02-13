import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CardComponent } from '../shared/components/card/card.component';
import { CardWrapperComponent } from '../shared/components/card-wrapper/card-wrapper.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CardComponent, CardWrapperComponent, ReactiveFormsModule, RouterLink, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly error = signal<string | null>(null);

  public readonly loginFormGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });

  public login(): void {
    if (this.loginFormGroup.invalid) {
      return;
    }

    this.authService
      .login({
        email: this.loginFormGroup.controls.email.value,
        password: this.loginFormGroup.controls.password.value,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          this.error.set(error.error.message);
          return throwError(() => error);
        }),
      )
      .subscribe(() => {
        console.log('Login successful');
        this.router.navigate(['/gamemode']);
      });
  }
}
