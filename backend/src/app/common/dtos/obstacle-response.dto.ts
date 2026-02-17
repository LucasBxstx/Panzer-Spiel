import { PositionResponseDto, ScaleResponseDto } from './vector-response.dto';
import { Expose, Type } from 'class-transformer';
import { TextureResponseDto } from './texture-response.dto';
import { Obstacle } from '../models/obstacle.model';

export class ObstacleResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => ScaleResponseDto)
  scale: ScaleResponseDto;

  @Expose()
  @Type(() => ScaleResponseDto)
  renderScale: ScaleResponseDto;

  @Expose()
  @Type(() => PositionResponseDto)
  position: PositionResponseDto;

  @Expose()
  modelUrl?: string;

  @Expose()
  @Type(() => TextureResponseDto)
  texture?: TextureResponseDto;

  @Expose()
  color?: string;

  static mapFromEntity(obstacle: Obstacle): ObstacleResponseDto {
    return {
      id: obstacle.id,
      name: obstacle.name,
      color: obstacle.color,
      position: PositionResponseDto.mapFromEntity(obstacle.position),
      scale: ScaleResponseDto.mapFromEntity(obstacle.scale),
      renderScale: ScaleResponseDto.mapFromEntity(obstacle.renderScale),
      modelUrl: obstacle.modelUrl,
      texture: obstacle.texture
        ? TextureResponseDto.mapFromEntity(obstacle.texture)
        : undefined,
    };
  }
}
