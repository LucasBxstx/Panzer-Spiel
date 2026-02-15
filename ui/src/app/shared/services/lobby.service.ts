import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { io, Socket } from 'socket.io-client';
import { CreateLobbyRequest, LobbyResponse } from '../models/lobby.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  private readonly authService = inject(AuthService);
  private socket: Socket | null = null;
  public readonly currentLobby = signal<LobbyResponse | null>(null);
  public readonly connected = signal(false);

  connect() {
    if (this.socket?.connected) return;

    const token = this.authService.getToken();

    if (!token) {
      return;
    }

    this.socket = io(`${environment.apiUrl}/lobby`, {
      auth: {
        token: token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to lobby');
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
      console.log('Disconnected:', reason);
      this.currentLobby.set(null);
      this.connected.set(false);
    });

    this.socket.on('lobbyCreated', (response: { event: string; data: LobbyResponse }) => {
      console.log('Lobby created:', response.data);
      this.currentLobby.set(response.data);
    });

    this.socket.on('lobbyUpdated', (response: { event: string; data: LobbyResponse }) => {
      this.currentLobby.set(response.data);
    });
  }

  createLobby(dto: CreateLobbyRequest): Observable<LobbyResponse> {
    if (!this.socket?.connected) {
      this.connect();
    }

    return new Observable<LobbyResponse>((observer) => {
      this.socket?.emit('createLobby', dto, (response: { event: string; data: LobbyResponse }) => {
        if (response && response.data) {
          observer.next(response.data);
          observer.complete();
        } else {
          observer.error(new Error('Keine Antwort vom Server erhalten'));
        }
      });

      const timeout = setTimeout(() => {
        observer.error(new Error('Timeout: Server antwortet nicht'));
      }, 10000);

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
      this.socket?.emit(
        'joinLobby',
        { lobbyId },
        (response: { event: string; data: LobbyResponse }) => {
          if (response?.data) {
            this.currentLobby.set(response.data);
            observer.next(response.data);
            observer.complete();
          } else {
            observer.error(new Error('Ungültige Server-Antwort'));
          }
        },
      );

      const timeout = setTimeout(() => {
        observer.error(new Error('Timeout: Server antwortet nicht'));
      }, 10000);

      return () => clearTimeout(timeout);
    });
  }

  leaveLobby(lobbyId: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.socket?.emit('leaveLobby', { lobbyId }, (response: any) => {
        if (response?.error) {
          observer.error(new Error(response.error));
        } else {
          this.disconnect();
          observer.next();
          observer.complete();
        }
      });

      const timeout = setTimeout(() => {
        observer.error(new Error('Timeout: Server antwortet nicht'));
      }, 10000);

      return () => clearTimeout(timeout);
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
