import { Expose, Type } from 'class-transformer';
import { PositionResponseDto, ScaleResponseDto } from './vector-response.dto';
import { Bullet } from '../models/bullet.model';

export class BulletResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => PositionResponseDto)
  position: PositionResponseDto;

  @Expose()
  rotation: number;

  @Expose()
  modelUrl: string;

  @Expose()
  @Type(() => ScaleResponseDto)
  renderScale: ScaleResponseDto;

  static mapFromEntity(bullet: Bullet): BulletResponseDto {
    return {
      id: bullet.id,
      position: PositionResponseDto.mapFromEntity(bullet.position),
      renderScale: ScaleResponseDto.mapFromEntity(bullet.renderScale),
      modelUrl: bullet.modelUrl,
      rotation: bullet.rotation,
    };
  }
}
