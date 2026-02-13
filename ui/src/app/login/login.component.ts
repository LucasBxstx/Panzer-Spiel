import { Component, inject } from '@angular/core';
import { CardComponent } from '../shared/components/card/card.component';
import { CardWrapperComponent } from '../shared/components/card-wrapper/card-wrapper.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CardComponent, CardWrapperComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly router = inject(Router);

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
  }
}
