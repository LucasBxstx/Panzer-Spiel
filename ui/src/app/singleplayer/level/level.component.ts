import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { MapPreviewComponent } from '../../shared/components/map-preview/map-preview.component';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { LevelService } from '../../shared/services/level.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TankIconComponent } from '../../shared/components/tank-icon/tank-icon.component';
import { TankType } from '../../shared/models/tank.model';
import { TankSelectionComponent } from '../../shared/components/tank-selection/tank-selection.component';

@Component({
  selector: 'app-level',
  imports: [
    CardComponent,
    ChipComponent,
    MapPreviewComponent,
    PageWrapperComponent,
    SpinnerComponent,
    TankIconComponent,
    TankSelectionComponent,
  ],
  templateUrl: './level.component.html',
  styleUrl: './level.component.scss',
})
export class LevelComponent {
  private readonly levelService = inject(LevelService);
  public readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public readonly loadingSate = signal<'loading' | 'error' | 'loaded'>('loading');
  public readonly error = signal<string>('');
  public readonly selectedTankType = signal<TankType>(TankType.Panther);

  public readonly levelId = toSignal(
    this.route.paramMap.pipe(
      map((params) => {
        const id = params.get('id');
        return id ? Number(id) : undefined;
      }),
    ),
  );

  public readonly level = toSignal(
    toObservable(this.levelId).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((levelId) => {
        if (!levelId) {
          this.router.navigate(['/singleplayer']);
          return EMPTY;
        }
        return this.levelService.getLevel(levelId).pipe(
          catchError((err: HttpErrorResponse) => {
            this.loadingSate.set('error');
            this.error.set(err.message);
            if (err.status === 403) this.router.navigate(['/singleplayer']);
            return EMPTY;
          }),
        );
      }),
      tap(() => this.loadingSate.set('loaded')),
    ),
  );

  public startGame(): void {
    const levelId = this.level()?.id;
    if (!levelId) return;

    this.levelService
      .startLevel(levelId, {
        id: levelId,
        selectedTankType: this.selectedTankType(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.router.navigate(['/game', result.gameId], {
          queryParams: {
            level: levelId,
          },
        });
      });
  }
}
