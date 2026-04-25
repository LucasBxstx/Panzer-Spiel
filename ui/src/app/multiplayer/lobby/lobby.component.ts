import { Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { MapPreviewComponent } from '../../shared/components/map-preview/map-preview.component';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { LobbyService } from '../../shared/services/lobby.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize, interval, switchMap, take, tap } from 'rxjs';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { AudioService } from '../../shared/services/audio.service';

export const COUNT_DOWN_SECONDS = 3;
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
export class LobbyComponent implements OnInit, OnDestroy {
  public readonly authService = inject(AuthService);
  public readonly lobbyService = inject(LobbyService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly audioService = inject(AudioService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly isLoading = signal(true);
  public readonly error = signal<string | null>(null);
  public readonly isStartingIn = signal<number | null>(null);

  public ngOnInit() {
    const lobbyId = this.route.snapshot.params['id'];
    this.audioService.loadSound('countdown', 'assets/sounds/countdown.mp3');

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
        tap(() => {
          this.isStartingIn.set(COUNT_DOWN_SECONDS);
          this.audioService.play('countdown');
        }),
        debounceTime(100),
        switchMap((game) =>
          interval(1000).pipe(
            take(COUNT_DOWN_SECONDS),
            tap(() => {
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
    if (this.isStartingIn()) {
      return;
    }

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

  public ngOnDestroy() {
    console.log('Lobby OnDestroy');
    this.lobbyService.disconnect();
  }
}
