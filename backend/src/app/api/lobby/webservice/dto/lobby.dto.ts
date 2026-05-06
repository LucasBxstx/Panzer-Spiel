import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { GameMode } from '../../../../common/models/game-settings.model';
import { BotDifficulty } from '../../../../common/models/bot.model';
import { TankType } from '../../../../common/models/tank.model';

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

  @IsOptional()
  @IsEnum(BotDifficulty)
  botDifficulty?: BotDifficulty;

  @IsEnum(TankType)
  tankType: TankType;

  @IsOptional()
  @IsNumber()
  levelId: number;
}

export class JoinLobbyDto {
  @IsUUID()
  lobbyId: string;
}
