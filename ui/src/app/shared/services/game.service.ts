import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import {
  GameOverResponse,
  GameStateResponse,
  InitialGameStateResponse,
  InitialGameStateResponseDto,
  mapGameDtoToResponse,
} from '../models/game.model';
import { Observable } from 'rxjs';
import {
  FireBulletRequest,
  getMyTankProps,
  TankProps,
  UpdateTankPosition,
  UpdateTurretRotation,
} from '../models/tank.model';
import { updateGameState } from '../../game/game.utils.ts/update-game-state';
import { Router } from '@angular/router';
import { PlayerStats, TeamStats } from '../models/team.model';
import { HttpClient } from '@angular/common/http';
import { LobbyPreviewResponse } from '../models/lobby-preview.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly httpClient = inject(HttpClient);

  private socket: Socket | null = null;
  public readonly connected = signal(false);
  public readonly gameState = signal<InitialGameStateResponse | null>(null);
  public readonly myTankProps = signal<TankProps | null>(null);
  public readonly winningTeamId = signal<string | null>(null);

  public getMyCurrentGame(): Observable<LobbyPreviewResponse | null> {
    return this.httpClient.get<LobbyPreviewResponse>(`${environment.apiUrl}/game`);
  }

  connect() {
    const token = this.authService.getToken();

    if (this.socket?.connected || !token) {
      console.log('no connection possible');
      return;
    }

    this.socket = io(`${environment.apiUrl}/game`, {
      auth: {
        token: token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Game Websocket connected');
      this.connected.set(true);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection failed:', error.message);
      this.connected.set(false);
      this.gameState.set(null);
      this.myTankProps.set(null);

      if (error.message === 'Unauthorized') {
        this.authService.logout();
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Game service Disconnected:', reason);
      this.gameState.set(null);
      this.myTankProps.set(null);
      this.connected.set(false);
    });

    this.socket.on('stateUpdate', (newState: GameStateResponse) => {
      const oldState = this.gameState();

      if (!oldState) return;
      this.gameState.set(updateGameState(oldState, newState));
    });

    this.socket.on('gameOver', (response: GameOverResponse) => {
      this.winningTeamId.set(response.winningTeamId);
      const gameId = this.gameState()?.id;

      this.router.navigate(['/game', gameId, 'gameover'], {
        queryParamsHandling: 'preserve',
      });
    });
  }

  public joinGame(gameId: string): Observable<InitialGameStateResponse> {
    if (!this.socket?.connected) {
      this.connect();
    }

    return new Observable<InitialGameStateResponse>((observer) => {
      this.socket?.emit('joinGame', { gameId }, (response: InitialGameStateResponseDto) => {
        if (response && response.id) {
          console.log('Joined Game successfully:', response);

          const gameState = mapGameDtoToResponse(response);
          this.gameState.set(gameState);
          this.myTankProps.set(getMyTankProps(gameState.tanks, gameState.myTankId));
          observer.next(gameState);
          observer.complete();
        } else {
          console.error('Invalid join response:', response);
          observer.error(new Error('Ungültige Server-Antwort'));
        }
      });

      const timeout = setTimeout(() => {
        console.error('Timeout waiting for joinGame response');
        observer.error(new Error('Timeout: Server antwortet nicht'));
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    });
  }

  public leaveGame(): Observable<{ success: boolean }> {
    return new Observable<{ success: boolean }>((observer) => {
      const timeout = setTimeout(() => {
        console.error('Timeout waiting for leaveGame response');
        observer.error(new Error('Timeout: Server antwortet nicht'));
      }, 5000);

      this.socket?.emit('leaveGame', {}, (response: { success: boolean }) => {
        clearTimeout(timeout); // Timeout stoppen
        observer.next(response); // Antwort weitergeben
        observer.complete(); // Observable beenden
        this.disconnect(); // Danach disconnect
      });

      return () => {
        clearTimeout(timeout);
      };
    });
  }

  public updateTankPosition(dto: UpdateTankPosition) {
    this.socket?.emit('updateTankPosition', dto, () => {
      // console.log('Update ' + dto.seq + 'tank position successful', response.confirmed);
    });
  }

  public updateTurretRotation(dto: UpdateTurretRotation) {
    this.socket?.emit('updateTurretRotation', dto, () => {
      // console.log('Update turret rotation successful', response.confirmed);
    });
  }

  public fireBullet(dto: FireBulletRequest) {
    this.socket?.emit('fireBullet', dto, (response: any) => {
      console.log('fireBullet', response);
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected.set(false);
      this.gameState.set(null);
      this.winningTeamId.set(null);
    }
  }

  public readonly timeUntilGameStarts: Signal<number | null> = computed(() => {
    const gamestate = this.gameState();
    if (!gamestate) return null;

    return Math.max(0, Math.ceil(gamestate.startingInMS / 1000));
  });

  public readonly timeSinceGameStarted: Signal<number | null> = computed(() => {
    const gamestate = this.gameState();
    if (!gamestate) return null;

    return Math.max(0, Math.ceil(gamestate.startingInMS / -1000));
  });

  public readonly teamsWithStats: Signal<TeamStats[] | null> = computed(() => {
    const gamestate = this.gameState();

    if (!gamestate) {
      return null;
    }

    return gamestate.teams.map((team) => {
      const playerStats = team.players.map((player) => {
        const playerTank = gamestate.tanks.get(player.tankId);
        return {
          id: player.userId,
          name: player.name,
          isDead: playerTank?.idDead ?? true,
          kills: playerTank?.kills ?? 0,
        } as PlayerStats;
      });

      return {
        id: team.id,
        name: team.name,
        color: team.color,
        playerStats,
      } as TeamStats;
    });
  });
}
