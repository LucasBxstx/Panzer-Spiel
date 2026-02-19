import { Expose } from 'class-transformer';

export class UpdateTankPositionResponseDto {
  @Expose()
  success: boolean;
}

export class UpdateTurretRotationResponseDto {
  @Expose()
  success: boolean;
}
