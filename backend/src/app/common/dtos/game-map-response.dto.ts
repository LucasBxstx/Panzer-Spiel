import { ObstacleResponseDto } from './obstacle-response.dto';
import { Expose, Type } from 'class-transformer';
import { ScaleResponseDto } from './vector-response.dto';

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
}
