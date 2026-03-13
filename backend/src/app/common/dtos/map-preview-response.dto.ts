import { Expose } from 'class-transformer';
import { GameMap } from '../models/game-map.model';

export class MapPreviewResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  pictureUrl: string;

  @Expose()
  maxTeamCount: number;

  @Expose()
  maxTeamSize: number;

  static mapFromEntity(map: GameMap): MapPreviewResponseDto {
    return {
      id: map.id,
      name: map.name,
      pictureUrl: map.pictureUrl,
      maxTeamCount: map.teamEntryPoints.length,
      maxTeamSize: map.teamEntryPoints.reduce((previous, current) =>
        previous.point.length > current.point.length ? previous : current,
      ).point.length,
    };
  }
}
