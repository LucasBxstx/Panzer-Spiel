import { Game } from '../../common/models/game.model';

export function isGameOver(game: Game): boolean {
  const isTeamAlive = new Map<string, boolean>();
  Array.from(game.teams.values()).forEach((team) => {
    const isAtLeastOneAlive = team.tankIds.some((tankId) => {
      const tank = game.tanks.get(tankId);

      return tank ? !tank.isDead : false;
    });
    isTeamAlive.set(team.id, isAtLeastOneAlive);
  });

  const remainingTeams = Array.from(isTeamAlive.entries())
    .filter(([team, alive]) => alive)
    .map(([team]) => team);

  if (remainingTeams.length === 1) {
    game.winningTeamId = remainingTeams[0];
    return true;
  }
  return false;
}
