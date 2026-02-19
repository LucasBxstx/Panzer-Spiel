import { PlayerResponse } from './player.model';

export interface TeamResponse {
  id: string;
  name: string;
  players: PlayerResponse[];
}
