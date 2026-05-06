import { Component, DestroyRef, inject } from '@angular/core';
import { CardComponent } from '../shared/components/card/card.component';
import { PageWrapperComponent } from '../shared/components/page-wrapper/page-wrapper.component';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LevelService } from '../shared/services/level.service';
import { LevelPreviewComponent } from './level-preview/level-preview.component';
import { LevelPreviewResponse } from '../shared/models/level.model';
import { catchError, throwError } from 'rxjs';

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
    this.levelService.getAllLevels().pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);
      }),
    ),
    { initialValue: [] },
  );

  public navigateToLevel(level: LevelPreviewResponse) {
    if (level.unlocked) this.router.navigate(['/singleplayer/level', level.id]);
  }
}
