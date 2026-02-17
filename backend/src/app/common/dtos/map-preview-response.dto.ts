import { Expose } from 'class-transformer';
import { GameMap } from '../models/game-map.model';

export class MapPreviewResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  pictureUrl: string;

  static mapFromEntity(map: GameMap): MapPreviewResponseDto {
    return {
      id: map.id,
      name: map.name,
      pictureUrl: map.pictureUrl,
    };
  }
}
