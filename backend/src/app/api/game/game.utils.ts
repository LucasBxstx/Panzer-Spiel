import { v4 as uuidv4 } from 'uuid';
import { Team } from '../../common/models/team.model';
import { Lobby } from '../../common/models/lobby.model';
import { Player } from '../../common/models/player.model';
import { GameMode } from '../../common/models/game-settings.model';

export function getPlayers(lobby: Lobby): Map<string, Player> {
  return new Map<string, Player>(
    lobby.players.map((p) => [
      p.userId,
      {
        ...p,
        isConnected: false,
        teamId: '',
        tankId: '',
        isRejoining: false,
        isBot: false,
      },
    ]),
  );
}

export function createBots(lobby: Lobby, players: Map<string, Player>) {
  const botNames = ['Alice', 'Bob', 'Carolin', 'Harald'];
  for (let i = 0; i < lobby.gameSettings.numberOfBots; i++) {
    const bot: Player = {
      userId: uuidv4(),
      isBot: true,
      isConnected: true,
      isRejoining: false,
      teamId: '',
      tankId: '',
      name: botNames[i],
      socketId: '',
    };
    players.set(bot.userId, bot);
  }
}

export function createTeams(
  lobby: Lobby,
  players: Player[],
): Map<string, Team> {
  const teamNames = getTeamNames();
  const colors = getColors();
  const teams: Map<string, Team> = new Map();

  const setTeam = (teamId: string, playersIds: string[], index: number) => {
    teams.set(teamId, {
      id: teamId,
      name: teamNames[index],
      color: colors[index],
      playersIds,
      tankIds: [],
    });
  };

  if (lobby.gameSettings.gameMode === GameMode.TeamVsBots) {
    const realPlayers = players.filter((p) => !p.isBot);
    const botPlayers = players.filter((p) => p.isBot);
    const playerTeamId = uuidv4();
    const botTeamId = uuidv4();
    const playersIds: string[] = [];
    const botIds: string[] = [];

    for (let j = 0; j < lobby.gameSettings.teamSize; j++) {
      const player = realPlayers[j];
      player.teamId = playerTeamId;
      playersIds.push(player.userId);
    }

    for (let k = 0; k < lobby.gameSettings.numberOfBots; k++) {
      const player = botPlayers[k];
      player.teamId = botTeamId;
      botIds.push(player.userId);
    }

    setTeam(playerTeamId, playersIds, 0);
    setTeam(botTeamId, botIds, 1);

    return teams;
  }

  for (let i = 0; i < lobby.gameSettings.numberOfTeams; i++) {
    const teamId = uuidv4();
    const playersIds: string[] = [];

    for (let j = 0; j < lobby.gameSettings.teamSize; j++) {
      const player = players[i * lobby.gameSettings.teamSize + j];
      player.teamId = teamId;
      playersIds.push(player.userId);
    }

    setTeam(teamId, playersIds, i);
  }

  return teams;
}

function getTeamNames() {
  return [
    'Purple',
    'Red',
    'Blue',
    'Yellow',
    'Green',
    'Orange',
    'Teal',
    'Pink',
    'Indigo',
    'Brown',
    'Cyan',
    'Lime',
  ];
}

function getColors() {
  return [
    '#8E24AA', // Purple
    '#D32F2F', // Red
    '#1976D2', // Blue
    '#FBC02D', // Yellow
    '#388E3C', // Green
    '#F57C00', // Orange
    '#00796B', // Teal
    '#C2185B', // Pink
    '#303F9F', // Indigo
    '#5D4037', // Brown
    '#0097A7', // Cyan
    '#689F38', // Lime
  ];
}
