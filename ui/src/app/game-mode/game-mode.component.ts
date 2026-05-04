import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent } from '../shared/components/card/card.component';
import { CardWrapperComponent } from '../shared/components/card-wrapper/card-wrapper.component';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-game-mode',
  imports: [CardComponent, CardWrapperComponent, FormsModule, NgOptimizedImage],
  templateUrl: './game-mode.component.html',
  styleUrl: './game-mode.component.scss',
})
export class GameModeComponent {
  public readonly router = inject(Router);
}
