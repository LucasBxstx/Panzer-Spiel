import { GameMap } from './game-map.model';
import { BotSetting } from './bot.model';
import { TankType } from './tank.model';

export interface GameSettings {
  gameMode: GameMode;
  map: GameMap;
  maxPlayersCount: number;
  numberOfTeams: number;
  numberOfBots: number;
  teamSize: number;
  botSettings?: BotSetting[];
  tankType: TankType;
}

export enum GameMode {
  OneVsOne = 'OneVsOne',
  TeamVsTeam = 'TeamVsTeam',
  TeamVsBots = 'TeamVsBots',
  SinglePlayer = 'SinglePlayer',
}
