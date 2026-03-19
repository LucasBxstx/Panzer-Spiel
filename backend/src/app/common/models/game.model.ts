import { Bullet } from './bullet.model';
import { GameSettings } from './game-settings.model';
import { Player } from './player.model';
import { Team } from './team.model';
import { Tank } from './tank.model';

export interface Game {
  id: string;
  hostUserName: string;
  gameSettings: GameSettings;
  players: Map<string, Player>;
  teams: Map<string, Team>;
  tanks: Map<string, Tank>;
  bullets: Map<string, Bullet>;
  startingAt: Date;
  createdAt: Date;
  winningTeamId?: string;
}
