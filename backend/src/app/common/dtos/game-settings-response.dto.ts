import { Expose, Type } from 'class-transformer';
import { MapPreviewResponseDto } from './map-preview-response.dto';
import { GameSettings } from '../models/game-settings.model';

import { GameModeOptionResponseDto } from './game-mode-option-response.dto';

export class GameSettingsResponseDto {
  @Expose()
  @Type(() => GameModeOptionResponseDto)
  gameModeOption: GameModeOptionResponseDto;

  @Expose()
  @Type(() => MapPreviewResponseDto)
  mapPreview: MapPreviewResponseDto;

  @Expose()
  maxPlayersCount: number;

  @Expose()
  numberOfTeams: number;

  @Expose()
  teamSize: number;

  static mapFromEntity(settings: GameSettings): GameSettingsResponseDto {
    return {
      gameModeOption: GameModeOptionResponseDto.mapFromEntity(
        settings.gameMode,
      ),
      mapPreview: MapPreviewResponseDto.mapFromEntity(settings.map),
      maxPlayersCount: settings.maxPlayersCount,
      teamSize: settings.teamSize,
      numberOfTeams: settings.numberOfTeams,
    };
  }
}
