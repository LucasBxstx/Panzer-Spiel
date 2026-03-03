import { Component, DestroyRef, inject } from '@angular/core';
import { CardComponent } from '../shared/components/card/card.component';
import { PageWrapperComponent } from '../shared/components/page-wrapper/page-wrapper.component';
import { LobbyPreviewComponent } from './lobby-preview/lobby-preview.component';
import { Router } from '@angular/router';
import { LobbyService } from '../shared/services/lobby.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-multiplayer',
  imports: [CardComponent, PageWrapperComponent, LobbyPreviewComponent],
  templateUrl: './multiplayer.component.html',
  styleUrl: './multiplayer.component.scss',
})
export class MultiplayerComponent {
  private readonly router = inject(Router);
  private readonly lobbyService = inject(LobbyService);
  private readonly gameService = inject(GameService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly lobbyPreviews = toSignal(
    this.lobbyService.pollOpenLobbies().pipe(takeUntilDestroyed(this.destroyRef)),
    { initialValue: [] },
  );

  public readonly myGame = toSignal(
    this.gameService.getMyCurrentGame().pipe(takeUntilDestroyed(this.destroyRef)),
    {
      initialValue: null,
    },
  );

  public createLobby(): void {
    this.router.navigate(['create-lobby']);
  }
}
