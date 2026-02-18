import { GameModeOption } from './lobby.model';
import { GameMapResponse } from './game-map.model';
import { TeamResponse } from './team.model';
import { TankResponse } from './tank.model';
import { BulletResponse } from './bullet.model';

export interface GameStateResponse {
  id: string;
  gameMode: GameModeOption;
  map: GameMapResponse;
  teams: TeamResponse[];
  tanks: TankResponse[];
  bullets: BulletResponse[];
  startingAt: Date;
}
