import { Component, DestroyRef, inject } from '@angular/core';
import { CardComponent } from '../shared/components/card/card.component';
import { PageWrapperComponent } from '../shared/components/page-wrapper/page-wrapper.component';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LevelService } from '../shared/services/level.service';
import { LevelPreviewComponent } from './level-preview/level-preview.component';

@Component({
  selector: 'app-singleplayer',
  imports: [CardComponent, PageWrapperComponent, LevelPreviewComponent],
  templateUrl: './singleplayer.component.html',
  styleUrl: './singleplayer.component.scss',
})
export class SingleplayerComponent {
  private readonly router = inject(Router);
  private readonly levelService = inject(LevelService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly levels = toSignal(
    this.levelService.getAllLevels().pipe(takeUntilDestroyed(this.destroyRef)),
    { initialValue: [] },
  );

  public navigateToLevel(id: number) {
    this.router.navigate([`/${id}`]);
  }
}
