import { GameMap } from './game-map.model';

export interface GameSettings {
  gameMode: GameMode;
  map: GameMap;
  maxPlayersCount: number;
  numberOfTeams: number;
  teamSize: number;
}

export enum GameMode {
  OneVsOne = 'OneVsOne',
  TeamVsTeam = 'TeamVsTeam',
  TeamVsBots = 'TeamVsBots',
}
