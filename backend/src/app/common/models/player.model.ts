export interface LobbyPlayer {
  userId: string;
  name: string;
  socketId: string;
  isConnected: boolean;
}

export interface Player extends LobbyPlayer {
  teamId: string;
  isBot: boolean; // In case the player is a bot, the userId is the botId
  tankId: string;
  isRejoining: boolean;
}
