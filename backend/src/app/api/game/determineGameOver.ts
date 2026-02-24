import { Game } from '../../common/models/game.model';

export function determineGameOver(game: Game): boolean {
  const isTeamAlive = new Map<string, boolean>();
  Array.from(game.teams.values()).forEach((team) => {
    const isAtLeastOneAlive = team.tankIds.some((tankId) => {
      const tank = game.tanks.get(tankId);

      return tank ? !tank.isDead : false;
    });
    isTeamAlive.set(team.id, isAtLeastOneAlive);
  });

  return Array.from(isTeamAlive.values()).filter((t) => t).length === 1;
}
