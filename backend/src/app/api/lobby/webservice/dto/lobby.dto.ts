import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { GameMode } from '../../../../common/models/game-settings.model';

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

  @IsNumber()
  numberOfBots: number;
}

export class JoinLobbyDto {
  @IsUUID()
  lobbyId: string;
}
