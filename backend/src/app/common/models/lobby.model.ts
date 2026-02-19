import { LobbyPlayer } from './player.model';
import { GameSettings } from './game-settings.model';

export interface Lobby {
  id: string;
  hostUserId: string;
  hostUserName: string;
  players: LobbyPlayer[];
  gameSettings: GameSettings;
  createdAt: Date;
}
