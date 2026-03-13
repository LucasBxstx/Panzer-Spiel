import { v4 as uuidv4 } from 'uuid';
import { Team } from '../../common/models/team.model';
import { Lobby } from '../../common/models/lobby.model';
import { Player } from '../../common/models/player.model';

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
      },
    ]),
  );
}

export function createTeams(
  lobby: Lobby,
  players: Player[],
): Map<string, Team> {
  const teamNames = [
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
  const colors = [
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
  const teams: Map<string, Team> = new Map();

  for (let i = 0; i < lobby.gameSettings.numberOfTeams; i++) {
    const teamId = uuidv4();
    const playersIds: string[] = [];

    for (let j = 0; j < lobby.gameSettings.teamSize; j++) {
      const player = players[i * lobby.gameSettings.teamSize + j];
      player.teamId = teamId;
      playersIds.push(player.userId);
    }

    teams.set(teamId, {
      id: teamId,
      name: teamNames[i],
      color: colors[i],
      playersIds,
      tankIds: [],
    });
  }

  return teams;
}
