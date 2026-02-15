import { Component, DestroyRef, inject } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { MapPreviewComponent } from '../../shared/components/map-preview/map-preview.component';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { LobbyService } from '../../shared/services/lobby.service';
import { Router } from '@angular/router';
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
export class LobbyComponent {
  public readonly authService = inject(AuthService);
  public readonly lobbyService = inject(LobbyService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // public readonly lobby = signal<LobbyResponse>({
  //   id: '1',
  //   hostUserName: 'Lucas',
  //   gameSettings: {
  //     mapPreview: {
  //       id: '1',
  //       name: 'Desert',
  //       pictureUrl: 'assets/pictures/map-desert.png',
  //     },
  //     gameModeOption: {
  //       name: '1 vs 1',
  //       value: GameMode.OneVsOne,
  //     },
  //     maxPlayersCount: 2,
  //     teamSize: 1,
  //     numberOfTeams: 2,
  //   },
  //
  //   joinedPlayers: [
  //     {
  //       userId: '1',
  //       name: 'Lucas',
  //     },
  //   ],
  // });

  public leaveLobby(): void {
    const lobby = this.lobbyService.currentLobby();
    if (!lobby) {
      return;
    }

    this.lobbyService
      .leaveLobby(lobby.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['/multiplayer']);
      });
  }
}
