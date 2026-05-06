import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent } from '../shared/components/card/card.component';
import { FormsModule } from '@angular/forms';
import { PageWrapperComponent } from '../shared/components/page-wrapper/page-wrapper.component';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-game-mode',
  imports: [CardComponent, FormsModule, PageWrapperComponent],
  templateUrl: './game-mode.component.html',
  styleUrl: './game-mode.component.scss',
})
export class GameModeComponent {
  public readonly router = inject(Router);
  public readonly authService = inject(AuthService);
}
