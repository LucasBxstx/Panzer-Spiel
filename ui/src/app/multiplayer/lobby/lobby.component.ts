import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { MapPreviewComponent } from '../../shared/components/map-preview/map-preview.component';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { LobbyService } from '../../shared/services/lobby.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-lobby',
  imports: [
    CardComponent,
    ChipComponent,
    MapPreviewComponent,
    PageWrapperComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
})
export class LobbyComponent implements OnInit {
  public readonly authService = inject(AuthService);
  public readonly lobbyService = inject(LobbyService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public readonly isLoading = signal(true);
  public readonly error = signal<string | null>(null);

  public ngOnInit() {
    const lobbyId = this.route.snapshot.params['id'];

    if (!lobbyId) {
      this.router.navigate(['/multiplayer']);
      return;
    }

    const currentLobby = this.lobbyService.currentLobby();
    const connected = this.lobbyService.connected();

    if (connected && currentLobby?.id === lobbyId) {
      console.log('Already in lobby:', lobbyId);
      this.isLoading.set(false);
    } else {
      console.log('Rejoining lobby after reload:', lobbyId);
      this.rejoinLobby(lobbyId);
    }
  }

  private rejoinLobby(lobbyId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.lobbyService
      .joinLobby(lobbyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (lobby) => {
          console.log('Rejoined lobby:', lobby);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error rejoining lobby:', err);
          this.error.set('Lobby konnte nicht beigetreten werden');
          this.isLoading.set(false);

          setTimeout(() => {
            this.router.navigate(['/multiplayer']);
          }, 2000);
        },
      });
  }

  public leaveLobby(): void {
    const lobby = this.lobbyService.currentLobby();
    if (!lobby) {
      this.router.navigate(['/multiplayer']);
      return;
    }

    this.lobbyService
      .leaveLobby(lobby.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        console.log('left lobby!!!');
        this.router.navigate(['/multiplayer']);
      });
  }
}
