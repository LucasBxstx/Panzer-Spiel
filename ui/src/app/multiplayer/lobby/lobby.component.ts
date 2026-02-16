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
import { finalize, interval, switchMap, take, tap } from 'rxjs';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-lobby',
  imports: [
    CardComponent,
    ChipComponent,
    MapPreviewComponent,
    PageWrapperComponent,
    ReactiveFormsModule,
    SpinnerComponent,
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
  public readonly isStartingIn = signal<number | null>(null);

  public ngOnInit() {
    const lobbyId = this.route.snapshot.params['id'];

    if (!lobbyId) {
      this.router.navigate(['/multiplayer']);
      return;
    }

    const currentLobby = this.lobbyService.currentLobby();
    const connected = this.lobbyService.connected();

    if (connected && currentLobby?.id === lobbyId) {
      this.isLoading.set(false);
    } else {
      this.rejoinLobby(lobbyId);
    }

    this.lobbyService.createdGameEvent
      .pipe(
        tap(() => this.isStartingIn.set(10)),
        switchMap((game) =>
          interval(1000).pipe(
            take(10),
            tap(() => {
              console.log('starting in ', game.id, this.isStartingIn());
              this.isStartingIn.update((v) => (v ? v - 1 : null));
            }),
            finalize(() => this.router.navigate([`/game/${game.id}`])),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
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
        error: () => {
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
      .leaveLobby()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['/multiplayer']);
      });
  }
}
