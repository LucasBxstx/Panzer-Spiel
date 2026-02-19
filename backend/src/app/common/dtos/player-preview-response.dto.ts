import { Expose } from 'class-transformer';
import { LobbyPlayer } from '../models/player.model';

export class PlayerPreviewResponseDto {
  @Expose()
  userId: string;

  @Expose()
  name: string;

  static mapFromEntity(player: LobbyPlayer): PlayerPreviewResponseDto {
    return {
      userId: player.userId,
      name: player.name,
    };
  }
}
