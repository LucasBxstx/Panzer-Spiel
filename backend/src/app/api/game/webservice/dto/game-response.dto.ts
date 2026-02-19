import { Expose, Type } from 'class-transformer';
import { GameMapResponseDto } from '../../../../common/dtos/game-map-response.dto';
import { GameModeOptionResponseDto } from '../../../../common/dtos/game-mode-option-response.dto';
import { TeamResponseDto } from '../../../../common/dtos/team-response.dto';
import { TankResponseDto } from '../../../../common/dtos/tank-response.dto';
import { BulletResponseDto } from '../../../../common/dtos/bullet-response.dto';
import { Game } from '../../../../common/models/game.model';

export class GameStateResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => GameModeOptionResponseDto)
  gameMode: GameModeOptionResponseDto;

  @Expose()
  @Type(() => GameMapResponseDto)
  map: GameMapResponseDto;

  @Expose()
  @Type(() => TeamResponseDto)
  teams: TeamResponseDto[];

  @Expose()
  @Type(() => TankResponseDto)
  tanks: Record<string, TankResponseDto>;

  @Expose()
  @Type(() => BulletResponseDto)
  bullets: BulletResponseDto[];

  @Expose()
  myTankId: string;

  @Expose()
  startingAt: Date;

  static mapFromEntity(game: Game, myTankId: string): GameStateResponseDto {
    return {
      id: game.id,
      gameMode: GameModeOptionResponseDto.mapFromEntity(
        game.gameSettings.gameMode,
      ),
      teams: Array.from(game.teams.values()).map((team) =>
        TeamResponseDto.mapFromEntity(team, game.players),
      ),
      map: GameMapResponseDto.mapFromEntity(game.gameSettings.map),
      tanks: Object.fromEntries(
        Array.from(game.tanks.values()).map((t) => [
          t.id,
          TankResponseDto.mapFromEntity(t),
        ]),
      ),
      bullets: Array.from(game.bullets.values()).map((b) =>
        BulletResponseDto.mapFromEntity(b),
      ),
      startingAt: game.startingAt,
      myTankId,
    };
  }
}
