import { Expose } from 'class-transformer';
import { GameMode } from '../models/game-settings.model';

export class GameModeOptionResponseDto {
  @Expose()
  name: string;

  @Expose()
  value: GameMode;

  static mapFromEntity(gameMode: GameMode): GameModeOptionResponseDto {
    return {
      name: this.getGameModeName(gameMode),
      value: gameMode,
    };
  }

  static getGameModeName(gameMode: GameMode): string {
    switch (gameMode) {
      case GameMode.OneVsOne:
        return '1 vs 1';
      case GameMode.TeamVsTeam:
        return 'Team vs Team';
      case GameMode.TeamVsBots:
        return 'Team vs Bots';
      default:
        return 'undefined';
    }
  }
}
