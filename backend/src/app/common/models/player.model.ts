export interface LobbyPlayer {
  userId: string;
  name: string;
  socketId: string;
  isConnected: boolean;
}

export interface Player extends LobbyPlayer {
  teamId: string;
  tankId: string;
  isRejoining: boolean;
}
