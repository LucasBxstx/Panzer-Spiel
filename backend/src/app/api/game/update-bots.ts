import { Bot } from '../../common/models/bot.model';
import { Game } from '../../common/models/game.model';
import { Tank } from '../../common/models/tank.model';
import { Position } from '../../common/models/position.model';
import { getDirectionVector } from '../../common/models/vector.model';

export function hasClearShoot(bot: Bot, game: Game): boolean {
  return true;
}

export function detectNearestEnemyTank(bot: Bot, game: Game): Tank | null {
  const botTank = game.tanks.get(bot.tankId);

  if (!botTank) return null;

  const aliveEnemyTanks = Array.from(game.tanks.values()).filter(
    (t) => t.teamId !== botTank.teamId && !t.isDead,
  );

  if (aliveEnemyTanks.length === 0) return null;

  let shortestDistance = Number.MAX_VALUE;
  let targetTank: Tank | null = null;

  aliveEnemyTanks.forEach((enemy) => {
    const distance = getEuclideanDistance(botTank.position, enemy.position);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      targetTank = enemy;
    }
  });

  return targetTank;
}

function getEuclideanDistance(a: Position, b: Position): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function aimAtTargetTank(bot: Bot, botTank: Tank, targetTank: Tank) {
  const directionVector = getDirectionVector(
    botTank.position,
    targetTank.position,
  );

  const targetRotation = Math.atan2(directionVector.x, directionVector.z);
  const relativeRotation = targetRotation - botTank.rotation;
  const diff = shortestRotation(botTank.turretRotation, relativeRotation);
  const lerpFactor = 0.15;

  botTank.turretRotation += diff * lerpFactor;
}

function shortestRotation(current: number, target: number): number {
  let diff = target - current;

  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;

  return diff;
}
