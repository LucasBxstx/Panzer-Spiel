import { GameModeOption } from './lobby.model';
import { GameMapResponse } from './game-map.model';
import { TeamResponse } from './team.model';
import { TankPositionResponse, TankResponse } from './tank.model';
import { BulletResponse } from './bullet.model';

export interface InitialGameStateResponseDto {
  id: string;
  gameMode: GameModeOption;
  map: GameMapResponse;
  teams: TeamResponse[];
  tanks: Record<string, TankResponse>;
  bullets: BulletResponse[];
  myTankId: string;
  startingInMS: number;
  winningTeamId?: string;
}

export interface InitialGameStateResponse {
  id: string;
  gameMode: GameModeOption;
  map: GameMapResponse;
  teams: TeamResponse[];
  tanks: Map<string, TankResponse>;
  bullets: BulletResponse[];
  myTankId: string;
  startingInMS: number;
  winningTeamId?: string;
}

export function mapGameDtoToResponse(dto: InitialGameStateResponseDto): InitialGameStateResponse {
  return {
    ...dto,
    tanks: new Map<string, TankResponse>(Object.entries(dto.tanks)),
  };
}

export interface GameStateResponse {
  id: string;
  tanks: TankPositionResponse[];
  bullets: BulletResponse[];
  winningTeamId?: string;
  startingInMS: number;
}

export interface GameOverResponse {
  winningTeamId: string;
}

export enum MultiplayerGameType {
  CUSTOM = 'Custom ',
  LEVEL = 'Level',
}
