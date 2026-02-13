export interface LobbyPreview {
  id: string;
  hostUserName: string;
  playersCount: number;
  maxPlayersCount: number;
  mapName: string;
  gameMode: GameMode;
}

export enum GameMode {
  OneVsOne = 'OneVsOne',
  TeamVsTeam = 'TeamVsTeam',
  TeamVsBots = 'TeamVsBots',
}
