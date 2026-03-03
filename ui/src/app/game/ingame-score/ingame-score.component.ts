import { Component, effect, inject, signal } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { GameService } from '../../shared/services/game.service';
import { TeamScoreComponent } from './team-score/team-score.component';
import { TeamStats } from '../../shared/models/team.model';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-ingame-score',
  imports: [NgOptimizedImage, DatePipe, TeamScoreComponent],
  templateUrl: './ingame-score.component.html',
  styleUrl: './ingame-score.component.scss',
})
export class IngameScoreComponent {
  public readonly gameService = inject(GameService);
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

  public isGameOver = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        console.log(event);
        return event.urlAfterRedirects.endsWith('/gameover');
      }),
    ),
    { initialValue: false },
  );

  public leaveGame(): void {
    this.router.navigate(['/multiplayer']);
    this.gameService.leaveGame().subscribe();
  }
}
