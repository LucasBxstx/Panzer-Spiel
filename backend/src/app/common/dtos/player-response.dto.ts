import { Expose } from 'class-transformer';
import { Player } from '../models/player.model';

export class PlayerResponseDto {
  @Expose()
  userId: string;

  @Expose()
  name: string;

  @Expose()
  tankId: string;

  static mapFromEntity(player: Player): PlayerResponseDto {
    return {
      userId: player.userId,
      name: player.name,
      tankId: player.tankId,
    };
  }
}
