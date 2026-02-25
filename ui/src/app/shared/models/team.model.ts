import { PlayerResponse } from './player.model';

export interface TeamResponse {
  id: string;
  name: string;
  color: string;
  players: PlayerResponse[];
}

export interface TeamStats {
  id: string;
  name: string;
  color: string;
  playerStats: PlayerStats[];
}
export interface PlayerStats {
  id: string;
  name: string;
  kills: number;
  isDead: boolean;
}
