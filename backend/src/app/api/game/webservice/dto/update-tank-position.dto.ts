import { IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class InputStateDto {
  @IsBoolean()
  w: boolean;

  @IsBoolean()
  a: boolean;

  @IsBoolean()
  s: boolean;

  @IsBoolean()
  d: boolean;
}

export class UpdateTankPositionDto {
  @IsNumber()
  seq: number;

  @ValidateNested()
  @Type(() => InputStateDto)
  input: InputStateDto;

  @IsNumber()
  deltaTime: number;

  @IsNumber()
  timestamp: number;
}
