import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PositionDto, Vector3DDto } from '../../../../common/dtos/vector.dto';

export class FireBulletDto {
  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;

  @ValidateNested()
  @Type(() => Vector3DDto)
  direction: Vector3DDto;
}
