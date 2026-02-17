import { PositionResponseDto, ScaleResponseDto } from './vector-response.dto';
import { Expose, Type } from 'class-transformer';

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
  textureUrl?: string;

  @Expose()
  color?: string;
}
