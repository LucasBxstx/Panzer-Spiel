import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { GameMode } from '../../../../common/interfaces/game.interfaces';

export class CreateLobbyDto {
  @IsUUID()
  mapId: string;

  @IsEnum(GameMode)
  gameMode: GameMode;

  @IsNumber()
  maxPlayersCount: number;

  @IsNumber()
  teamSize: number;

  @IsNumber()
  numberOfTeams: number;
}

export class JoinLobbyDto {
  @IsUUID()
  lobbyId: string;
}
