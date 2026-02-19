import { ObstacleResponseDto } from './obstacle-response.dto';
import { Expose, Type } from 'class-transformer';
import { ScaleResponseDto } from './vector-response.dto';
import { TextureResponseDto } from './texture-response.dto';
import { GameMap } from '../models/game-map.model';

export class GameMapResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => ObstacleResponseDto)
  obstacles: ObstacleResponseDto[];

  @Expose()
  @Type(() => ScaleResponseDto)
  scale: ScaleResponseDto;

  @Expose()
  @Type(() => TextureResponseDto)
  groundTexture: TextureResponseDto;

  static mapFromEntity(map: GameMap): GameMapResponseDto {
    return {
      id: map.id,
      name: map.name,
      scale: ScaleResponseDto.mapFromEntity(map.scale),
      obstacles: map.obstacles.map((m) => ObstacleResponseDto.mapFromEntity(m)),
      groundTexture: TextureResponseDto.mapFromEntity(map.groundTexture),
    };
  }
}
