import { Expose } from 'class-transformer';

export class GameStateResponseDto {
  @Expose()
  id: string;
}
