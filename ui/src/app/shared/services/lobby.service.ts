import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { io, Socket } from 'socket.io-client';
import { CreateLobbyRequest, LobbyResponse } from '../models/lobby.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
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

  public getAllOpenLobbies(): Observable<LobbyPreviewResponse[]> {
    return this.httpClient.get<LobbyPreviewResponse[]>(`${environment.apiUrl}/lobby`);
  }

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

    this.socket.on('lobbyCreated', (lobby: LobbyResponse) => {
      console.log('Lobby created:', lobby);
      this.currentLobby.set(lobby);
    });

    this.socket.on('lobbyUpdated', (lobby: LobbyResponse) => {
      this.currentLobby.set(lobby);
    });
  }

  createLobby(dto: CreateLobbyRequest): Observable<LobbyResponse> {
    if (!this.socket?.connected) {
      this.connect();
    }

    return new Observable<LobbyResponse>((observer) => {
      console.log('Emitting createLobby:', dto);

      this.socket?.emit('createLobby', dto, (response: any) => {
        console.log('Raw response from server:', response);

        // Response ist direkt das Lobby-Objekt
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
      }, 10000);

      return () => {
        console.log('Observable cleanup');
        clearTimeout(timeout);
      };
    });
  }

  joinLobby(lobbyId: string): Observable<LobbyResponse> {
    if (!this.socket?.connected) {
      this.connect();
    }

    return new Observable<LobbyResponse>((observer) => {
      console.log('Emitting joinLobby:', lobbyId);

      this.socket?.emit('joinLobby', { lobbyId }, (response: any) => {
        console.log('Raw response from joinLobby:', response);

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
      }, 10000);

      return () => {
        console.log('JoinLobby Observable cleanup');
        clearTimeout(timeout);
      };
    });
  }

  leaveLobby(lobbyId: string): Observable<void> {
    return new Observable<void>((observer) => {
      console.log('Emitting leaveLobby:', lobbyId);

      this.socket?.emit('leaveLobby', null, (response: any) => {
        console.log('Raw response from leaveLobby:', response);

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
      }, 10000);

      return () => {
        console.log('LeaveLobby Observable cleanup');
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
