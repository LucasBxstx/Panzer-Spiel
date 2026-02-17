import { Expose, Type } from 'class-transformer';
import { PositionResponseDto, ScaleResponseDto } from './vector-response.dto';
import { Tank } from '../models/tank.model';

export class TankResponseDto {
  @Expose()
  id: string;

  @Expose()
  playerName: string;

  @Expose()
  @Type(() => PositionResponseDto)
  position: PositionResponseDto;

  @Expose()
  @Type(() => ScaleResponseDto)
  renderScale: ScaleResponseDto;

  @Expose()
  speed: number;

  @Expose()
  rotationSpeed: number;

  @Expose()
  rotation: number;

  @Expose()
  kills: number;

  @Expose()
  isDead: boolean;

  static mapFromEntity(tank: Tank): TankResponseDto {
    return {
      id: tank.id,
      playerName: tank.playerName,
      position: PositionResponseDto.mapFromEntity(tank.position),
      renderScale: ScaleResponseDto.mapFromEntity(tank.renderScale),
      rotation: tank.rotation,
      rotationSpeed: tank.rotationSpeed,
      speed: tank.speed,
      isDead: tank.isDead,
      kills: tank.kills,
    };
  }
}
