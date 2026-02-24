import { PlayerResponse } from './player.model';

export interface TeamResponse {
  id: string;
  name: string;
  players: PlayerResponse[];
}

export interface TeamStats {
  id: string;
  name: string;
  playerStats: PlayerStats[];
}
export interface PlayerStats {
  id: string;
  name: string;
  kills: number;
  isDead: boolean;
}
