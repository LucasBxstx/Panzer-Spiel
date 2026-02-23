import { inject, Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import {
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

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly authService = inject(AuthService);

  private socket: Socket | null = null;
  public readonly connected = signal(false);
  public readonly gameState = signal<InitialGameStateResponse | null>(null);
  public readonly myTankProps = signal<TankProps | null>(null);

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
      console.log('Disconnected:', reason);
      this.gameState.set(null);
      this.myTankProps.set(null);
      this.connected.set(false);
    });

    this.socket.on('stateUpdate', (newState: GameStateResponse) => {
      const oldState = this.gameState();

      if (!oldState) return;
      updateGameState(oldState, newState);
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

  public updateTankPosition(dto: UpdateTankPosition) {
    this.socket?.emit('updateTankPosition', dto, (response: { confirmed: boolean }) => {
      // console.log('Update ' + dto.seq + 'tank position successful', response.confirmed);
    });
  }

  public updateTurretRotation(dto: UpdateTurretRotation) {
    this.socket?.emit('updateTurretRotation', dto, (response: { confirmed: boolean }) => {
      // console.log('Update turret rotation successful', response.confirmed);
    });
  }

  public fireBullet(dto: FireBulletRequest) {
    this.socket?.emit('fireBullet', dto, (response: { confirmed: boolean }) => {});
  }
}
