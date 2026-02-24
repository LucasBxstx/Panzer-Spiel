import { Component, computed, inject, OnInit } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import { Router } from '@angular/router';
import { GameService } from '../../shared/services/game.service';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-game-over',
  imports: [CardComponent, PageWrapperComponent, ChipComponent, NgOptimizedImage],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
})
export class GameOverComponent implements OnInit {
  private readonly router = inject(Router);
  public readonly gameService = inject(GameService);

  public ngOnInit() {
    setTimeout(() => {
      this.gameService.disconnect();
      this.router.navigate(['/multiplayer']);
    }, 25000);
  }

  public leaveGame(): void {
    this.gameService.disconnect();
    this.router.navigate(['/multiplayer']);
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
}
