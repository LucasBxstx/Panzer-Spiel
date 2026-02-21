import { IsNumber } from 'class-validator';

export class UpdateTurretRotationDto {
  @IsNumber()
  rotation: number;
}
