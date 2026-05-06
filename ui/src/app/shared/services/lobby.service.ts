import { EventEmitter, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { io, Socket } from 'socket.io-client';
import {
  CreateGameResponse,
  CreateLobbyRequest,
  LobbyCreationOptionsResponse,
  LobbyResponse,
} from '../models/lobby.model';
import { environment } from '../../../environments/environment';
import { interval, Observable, startWith, switchMap } from 'rxjs';
import { LobbyPreviewResponse } from '../models/lobby-preview.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  private readonly authService = inject(AuthService);
  private readonly httpClient = inject(HttpClient);

  private socket: Socket | null = null;
  public readonly currentLobby = signal<LobbyResponse | null>(null);
  public readonly connected = signal(false);
  public readonly createdGameEvent = new EventEmitter<{ id: string }>();

  public pollOpenLobbies(): Observable<LobbyPreviewResponse[]> {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.httpClient.get<LobbyPreviewResponse[]>(`${environment.apiUrl}/lobby`)),
    );
  }

  public getLobbyCreationOptions(): Observable<LobbyCreationOptionsResponse> {
    return this.httpClient.get<LobbyCreationOptionsResponse>(
      `${environment.apiUrl}/lobby/lobby-creation-options`,
    );
  }

  connect() {
    const token = this.authService.getToken();

    if (this.socket?.connected || !token) {
      return;
    }

    this.socket = io(`${environment.apiUrl}/lobby`, {
      auth: {
        token: token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Websocket connected');
      this.connected.set(true);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection failed:', error.message);
      this.connected.set(false);
      this.currentLobby.set(null);

      if (error.message === 'Unauthorized') {
        this.authService.logout();
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('lobby service Disconnected:', reason);
      this.currentLobby.set(null);
      this.connected.set(false);
    });

    this.socket.on('lobbyCreated', (lobby: LobbyResponse) => {
      console.log('Lobby created:', lobby);
      this.currentLobby.set(lobby);
    });

    this.socket.on('lobbyUpdated', (lobby: LobbyResponse) => {
      console.log('Lobby updated:', lobby);
      this.currentLobby.set(lobby);
    });

    this.socket.on('startGame', (response: CreateGameResponse) => {
      console.log('Created Game', response.gameId);
      this.createdGameEvent.emit({ id: response.gameId });
    });
  }

  createLobby(dto: CreateLobbyRequest): Observable<LobbyResponse> {
    if (!this.socket?.connected) {
      this.connect();
    }

    return new Observable<LobbyResponse>((observer) => {
      this.socket?.emit('createLobby', dto, (response: any) => {
        if (response && response.id) {
          console.log('Lobby created successfully:', response);
          this.currentLobby.set(response);
          observer.next(response);
          observer.complete();
        } else {
          console.error('Invalid response:', response);
          observer.error(new Error('Ungültige Server-Antwort'));
        }
      });

      const timeout = setTimeout(() => {
        console.error('Timeout waiting for server response');
        observer.error(new Error('Timeout: Server antwortet nicht'));
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    });
  }

  joinLobby(lobbyId: string): Observable<LobbyResponse> {
    if (!this.socket?.connected) {
      this.connect();
    }

    return new Observable<LobbyResponse>((observer) => {
      this.socket?.emit('joinLobby', { lobbyId }, (response: any) => {
        if (response && response.id) {
          console.log('Joined lobby successfully:', response);
          this.currentLobby.set(response);
          observer.next(response);
          observer.complete();
        } else {
          console.error('Invalid join response:', response);
          observer.error(new Error('Ungültige Server-Antwort'));
        }
      });

      const timeout = setTimeout(() => {
        console.error('Timeout waiting for joinLobby response');
        observer.error(new Error('Timeout: Server antwortet nicht'));
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    });
  }

  leaveLobby(): Observable<void> {
    return new Observable<void>((observer) => {
      this.socket?.emit('leaveLobby', null, (response: any) => {
        if (response?.error) {
          console.error('Error leaving lobby:', response.error);
          observer.error(new Error(response.error));
        } else {
          console.log('Left lobby successfully');
          this.currentLobby.set(null);
          this.disconnect();
          observer.next();
          observer.complete();
        }
      });

      const timeout = setTimeout(() => {
        console.error('Timeout waiting for leaveLobby response');
        observer.error(new Error('Timeout: Server antwortet nicht'));
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected.set(false);
      this.currentLobby.set(null);
    }
  }
}
