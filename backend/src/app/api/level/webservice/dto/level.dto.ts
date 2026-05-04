import { IsEnum, IsNumber } from 'class-validator';
import { TankType } from '../../../../common/models/tank.model';

export class PlayLevelDto {
  @IsNumber()
  id: number;

  @IsEnum(TankType)
  selectedTankType: TankType;
}
