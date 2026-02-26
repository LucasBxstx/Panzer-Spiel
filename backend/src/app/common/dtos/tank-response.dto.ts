import { Expose, Type } from 'class-transformer';
import { PositionResponseDto, ScaleResponseDto } from './vector-response.dto';
import { Tank } from '../models/tank.model';

export class TankResponseDto {
  @Expose()
  id: string;

  @Expose()
  playerName: string;

  @Expose()
  teamColor: string;

  @Expose()
  modelUrl: string;

  @Expose()
  @Type(() => PositionResponseDto)
  position: PositionResponseDto;

  @Expose()
  @Type(() => ScaleResponseDto)
  renderScale: ScaleResponseDto;

  @Expose()
  @Type(() => ScaleResponseDto)
  scale: ScaleResponseDto;

  @Expose()
  speed: number;

  @Expose()
  rotationSpeed: number;

  @Expose()
  rotation: number;

  @Expose()
  turretRotation: number;

  @Expose()
  kills: number;

  @Expose()
  isDead: boolean;

  @Expose()
  seq: number;

  @Expose()
  @Type(() => PositionResponseDto)
  cameraPosition: PositionResponseDto;

  static mapFromEntity(tank: Tank): TankResponseDto {
    return {
      id: tank.id,
      playerName: tank.playerName,
      teamColor: tank.teamColor,
      modelUrl: tank.modelUrl,
      position: PositionResponseDto.mapFromEntity(tank.position),
      renderScale: ScaleResponseDto.mapFromEntity(tank.renderScale),
      scale: ScaleResponseDto.mapFromEntity(tank.scale),
      cameraPosition: PositionResponseDto.mapFromEntity(tank.cameraPosition),
      rotation: tank.rotation,
      rotationSpeed: tank.rotationSpeed,
      turretRotation: tank.turretRotation,
      speed: tank.speed,
      isDead: tank.isDead,
      kills: tank.kills,
      seq: tank.lastProcessedSeq,
    };
  }
}

export class TankPositionResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => PositionResponseDto)
  position: PositionResponseDto;

  @Expose()
  rotation: number;

  @Expose()
  turretRotation: number;

  @Expose()
  seq: number;

  @Expose()
  kills: number;

  @Expose()
  isDead: boolean;

  static mapFromEntity(tank: Tank): TankPositionResponseDto {
    return {
      id: tank.id,
      position: PositionResponseDto.mapFromEntity(tank.position),
      rotation: tank.rotation,
      turretRotation: tank.turretRotation,
      kills: tank.kills,
      isDead: tank.isDead,
      seq: tank.lastProcessedSeq,
    };
  }
}
