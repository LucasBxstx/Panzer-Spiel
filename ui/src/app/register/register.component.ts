import { Component } from '@angular/core';
import { CardComponent } from '../shared/components/card/card.component';
import { CardWrapperComponent } from '../shared/components/card-wrapper/card-wrapper.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CardComponent, CardWrapperComponent, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public readonly registerFormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(4)],
      nonNullable: true,
    }),
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
    if (this.registerFormGroup.invalid) {
      return;
    }
  }
}
