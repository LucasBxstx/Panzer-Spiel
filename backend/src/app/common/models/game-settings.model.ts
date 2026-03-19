import { GameMap } from './game-map.model';

export interface GameSettings {
  gameMode: GameMode;
  map: GameMap;
  maxPlayersCount: number;
  numberOfTeams: number;
  numberOfBots: number;
  teamSize: number;
}

export enum GameMode {
  OneVsOne = 'OneVsOne',
  TeamVsTeam = 'TeamVsTeam',
  TeamVsBots = 'TeamVsBots',
}
