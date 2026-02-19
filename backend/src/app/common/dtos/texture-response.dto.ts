import { Expose, Type } from 'class-transformer';
import { Vector2DResponseDto } from './vector-response.dto';
import { Texture } from '../models/texture.model';

export class TextureResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  diffuseImageUrl: string;

  @Expose()
  normalImageUrl: string;

  @Expose()
  roughnessImageUrl: string;

  @Expose()
  @Type(() => Vector2DResponseDto)
  repeat: Vector2DResponseDto;

  static mapFromEntity(texture: Texture): TextureResponseDto {
    return {
      id: texture.id,
      name: texture.name,
      diffuseImageUrl: texture.diffuseImageUrl,
      normalImageUrl: texture.normalImageUrl,
      roughnessImageUrl: texture.roughnessImageUrl,
      repeat: texture.repeat,
    };
  }
}
