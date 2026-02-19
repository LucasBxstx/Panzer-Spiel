import { Expose } from 'class-transformer';
import { Vector2D, Vector3D } from '../models/vector.model';
import { Scale } from '../models/scale.model';
import { Position } from '../models/position.model';

export class Vector2DResponseDto {
  @Expose()
  x: number;

  @Expose()
  y: number;

  static mapFromEntity(vector: Vector2D): Vector2DResponseDto {
    return {
      x: vector.x,
      y: vector.y,
    };
  }
}

export class Vector3DResponseDto extends Vector2DResponseDto {
  @Expose()
  z: number;

  static mapFromEntity(vector: Vector3D): Vector3DResponseDto {
    return {
      x: vector.x,
      y: vector.y,
      z: vector.z,
    };
  }
}

export class ScaleResponseDto extends Vector3DResponseDto {
  static mapFromEntity(scale: Scale): ScaleResponseDto {
    return Vector3DResponseDto.mapFromEntity(scale);
  }
}

export class PositionResponseDto extends Vector3DResponseDto {
  static mapFromEntity(position: Position): PositionResponseDto {
    return Vector3DResponseDto.mapFromEntity(position);
  }
}
