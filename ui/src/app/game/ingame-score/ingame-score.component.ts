import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { GameService } from '../../shared/services/game.service';
import { TeamScoreComponent } from './team-score/team-score.component';
import { TeamStats } from '../../shared/models/team.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-ingame-score',
  imports: [NgOptimizedImage, DatePipe, TeamScoreComponent],
  templateUrl: './ingame-score.component.html',
  styleUrl: './ingame-score.component.scss',
})
export class IngameScoreComponent {
  public readonly gameService = inject(GameService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  public readonly teamScoreLeft = signal<TeamStats[]>([]);
  public readonly teamScoreRight = signal<TeamStats[]>([]);

  constructor() {
    effect(() => {
      const teamStats = this.gameService.teamsWithStats();
      if (!teamStats) return;

      this.teamScoreLeft.set([]);
      this.teamScoreRight.set([]);

      let nextLeft = true;
      for (let i = 0; i < teamStats.length; i++) {
        if (nextLeft) {
          this.teamScoreLeft.update((v) => [...v, teamStats[i]]);
        } else {
          this.teamScoreRight.update((v) => [...v, teamStats[i]]);
        }
        nextLeft = !nextLeft;
      }
    });
  }

  public leaveGame(): void {
    this.gameService
      .leaveGame()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.router.navigate(['/multiplayer'])),
      )
      .subscribe(() => {});
  }
}
