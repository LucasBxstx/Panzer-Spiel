import { GameModeOption } from './lobby.model';
import { GameMapResponse } from './game-map.model';
import { TeamResponse } from './team.model';
import { TankResponse } from './tank.model';
import { BulletResponse } from './bullet.model';

export interface GameStateResponseDto {
  id: string;
  gameMode: GameModeOption;
  map: GameMapResponse;
  teams: TeamResponse[];
  tanks: Record<string, TankResponse>;
  bullets: BulletResponse[];
  myTankId: string;
  startingAt: Date;
}

export interface GameStateResponse {
  id: string;
  gameMode: GameModeOption;
  map: GameMapResponse;
  teams: TeamResponse[];
  tanks: Map<string, TankResponse>;
  bullets: BulletResponse[];
  myTankId: string;
  startingAt: Date;
}

export function mapGameDtoToResponse(dto: GameStateResponseDto): GameStateResponse {
  return {
    ...dto,
    tanks: new Map<string, TankResponse>(Object.entries(dto.tanks)),
  };
}
