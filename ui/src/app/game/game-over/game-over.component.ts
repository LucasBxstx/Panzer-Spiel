import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../shared/services/game.service';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { AudioService } from '../../shared/services/audio.service';
import { map, timer } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-game-over',
  imports: [CardComponent, PageWrapperComponent, ChipComponent, NgOptimizedImage],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
})
export class GameOverComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  public readonly gameService = inject(GameService);
  private readonly authService = inject(AuthService);
  private readonly audioService = inject(AudioService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly levelId = toSignal(
    this.route.paramMap.pipe(
      map((params) => {
        const id = params.get('level');
        return id ? Number(id) : undefined;
      }),
    ),
  );

  public readonly navigateTo = computed(() =>
    this.levelId() === undefined ? '/singleplayer' : '/multiplayer',
  );

  public async ngOnInit() {
    const gameState = this.gameService.gameState();
    if (!gameState) return;

    const myUserId = this.authService.user()!.id;
    const myTeamId = gameState.teams.find((t) => t.players.some((p) => p.userId === myUserId))?.id;
    const IAmWinner = this.gameService.winningTeamId() === myTeamId;

    if (IAmWinner) {
      await this.audioService.loadSound('game-won', 'assets/sounds/game-won.mp3');
      this.audioService.play('game-won');
    }

    timer(25000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate([this.navigateTo()]));
  }

  public leaveGame(): void {
    this.gameService.disconnect();
    this.router.navigate([this.navigateTo()]);
  }

  public readonly winnerTeam = computed(() => {
    const gameState = this.gameService.gameState();
    if (!gameState) return undefined;
    const winningTeamId = gameState.winningTeamId ?? this.gameService.winningTeamId();
    return gameState.teams.find((t) => t.id === winningTeamId);
  });

  public getKills(kills: number): number[] {
    const num: number[] = [];
    for (let i = 0; i < kills; i++) {
      num.push(kills + 1);
    }
    return num;
  }

  public goToNextLevel(): void {
    const levelId = this.levelId();
    if (!levelId) {
      return;
    }
    this.router.navigate(['/singleplayer/level', levelId + 1]);
  }
}
