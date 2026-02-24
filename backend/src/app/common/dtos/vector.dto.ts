import { IsNumber } from 'class-validator';

export class Vector3DDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  z: number;
}

export class PositionDto extends Vector3DDto {}
