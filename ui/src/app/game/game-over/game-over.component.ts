import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import { Router } from '@angular/router';
import { GameService } from '../../shared/services/game.service';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { NgOptimizedImage } from '@angular/common';

export interface TeamStats {
  id: string;
  name: string;
  playerStats: PlayerStats[];
}
export interface PlayerStats {
  id: string;
  name: string;
  kills: number;
  isDead: boolean;
}

@Component({
  selector: 'app-game-over',
  imports: [CardComponent, PageWrapperComponent, ChipComponent, NgOptimizedImage],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
})
export class GameOverComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);

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

  public readonly teamWithStats: Signal<TeamStats[] | null> = computed(() => {
    const gamestate = this.gameService.gameState();

    if (!gamestate) {
      return null;
    }

    return gamestate.teams.map((team) => {
      const playerStats = team.players.map((player) => {
        const playerTank = gamestate.tanks.get(player.tankId);
        return {
          id: player.id,
          name: player.name,
          isDead: playerTank?.idDead ?? true,
          kills: playerTank?.kills ?? 0,
        } as PlayerStats;
      });
      return {
        id: team.id,
        name: team.name,
        playerStats,
      } as TeamStats;
    });
  });

  public getKills(kills: number): number[] {
    const num: number[] = [];
    for (let i = 0; i < kills; i++) {
      num.push(kills + 1);
    }
    return num;
  }
}
