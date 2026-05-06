import { GameModeOption } from './lobby.model';

export interface LobbyPreviewResponse {
  id: string;
  hostUserName: string;
  playersCount: number;
  maxPlayersCount: number;
  mapName: string;
  gameMode: GameModeOption;
}

export enum GameMode {
  OneVsOne = 'OneVsOne',
  TeamVsTeam = 'TeamVsTeam',
  TeamVsBots = 'TeamVsBots',
  SinglePlayer = 'SinglePlayer',
  TeamLevel = 'TeamLevel',
}
