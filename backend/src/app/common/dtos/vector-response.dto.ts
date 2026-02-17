import { Expose } from 'class-transformer';

export class VectorResponseDto {
  @Expose()
  x: number;

  @Expose()
  y: number;

  @Expose()
  z: number;
}

export class ScaleResponseDto extends VectorResponseDto {}

export class PositionResponseDto extends VectorResponseDto {}
