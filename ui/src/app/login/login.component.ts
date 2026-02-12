import { Component } from '@angular/core';
import { CardComponent } from '../shared/components/card/card.component';
import { CardWrapperComponent } from '../shared/components/card-wrapper/card-wrapper.component';

@Component({
  selector: 'app-login',
  imports: [CardComponent, CardWrapperComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {}
