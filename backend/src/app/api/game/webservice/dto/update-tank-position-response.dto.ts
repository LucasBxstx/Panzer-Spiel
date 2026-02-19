import { Expose } from 'class-transformer';

export class UpdateTankPositionResponseDto {
  @Expose()
  success: boolean;
}
