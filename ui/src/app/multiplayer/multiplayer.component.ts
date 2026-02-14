import { Component, inject } from '@angular/core';
import { CardComponent } from '../shared/components/card/card.component';
import { PageWrapperComponent } from '../shared/components/page-wrapper/page-wrapper.component';
import { GameMode, LobbyPreview } from '../shared/models/lobby-preview.model';
import { LobbyPreviewComponent } from './lobby-preview/lobby-preview.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multiplayer',
  imports: [CardComponent, PageWrapperComponent, LobbyPreviewComponent],
  templateUrl: './multiplayer.component.html',
  styleUrl: './multiplayer.component.scss',
})
export class MultiplayerComponent {
  private readonly router = inject(Router);

  public readonly lobbyPreviews: LobbyPreview[] = [
    {
      id: '1',
      hostUserName: 'Lucas',
      mapName: 'Desert',
      gameMode: GameMode.OneVsOne,
      maxPlayersCount: 2,
      playersCount: 1,
    },
    {
      id: '2',
      hostUserName: 'Sofie',
      mapName: 'Jungle',
      gameMode: GameMode.TeamVsBots,
      maxPlayersCount: 3,
      playersCount: 1,
    },
    {
      id: '3',
      hostUserName: 'Flo',
      mapName: 'Temple',
      gameMode: GameMode.TeamVsTeam,
      maxPlayersCount: 4,
      playersCount: 2,
    },
  ];

  public createLobby(): void {
    this.router.navigate(['create-lobby']);
  }
}
