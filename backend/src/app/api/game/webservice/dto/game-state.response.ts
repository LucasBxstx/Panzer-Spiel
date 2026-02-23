import { Expose } from 'class-transformer';

export class SuccessResponseDto {
  @Expose()
  success: boolean;
}

export class UpdateTankPositionResponseDto extends SuccessResponseDto {}

export class UpdateTurretRotationResponseDto extends SuccessResponseDto {}

export class FireBulletResponseDto extends SuccessResponseDto {}
