import { Bot, BotDifficulty } from '../../common/models/bot.model';
import { Game } from '../../common/models/game.model';
import { Tank } from '../../common/models/tank.model';
import { Position } from '../../common/models/position.model';
import {
  create3DVector,
  getDirectionVector,
  normalizeInPlace,
  Vector3D,
} from '../../common/models/vector.model';
import { InputStateDto } from './webservice/dto/update-tank-position.dto';
import { FireBulletDto } from './webservice/dto/fire-bullet.dto';

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

export function aimAtTargetTank(botTank: Tank, targetTank: Tank): Vector3D {
  const directionVector = getDirectionVector(
    botTank.position,
    targetTank.position,
  );
  normalizeInPlace(directionVector);

  const targetRotation = Math.atan2(directionVector.x, directionVector.z);
  const relativeRotation = targetRotation - botTank.rotation;
  const diff = shortestRotation(botTank.turretRotation, relativeRotation);
  const lerpFactor = 0.15;

  botTank.turretRotation += diff * lerpFactor;

  return directionVector;
}

function shortestRotation(current: number, target: number): number {
  let diff = target - current;

  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;

  return diff;
}

export function canShoot(bot: Bot, botTank: Tank): boolean {
  const lastShoot = new Date(bot.lastShoot);
  const now = new Date();

  return (
    !botTank.isDead &&
    now.getTime() - lastShoot.getTime() > bot.shootingBufferMS
  );
}

export function getBotAimingJitter(
  bot: Bot,
  directionVector: Vector3D,
): Vector3D {
  const jitterOptions = new Map<BotDifficulty, number>([
    [BotDifficulty.EASY, 0.3],
    [BotDifficulty.INTERMEDIATE, 0.15],
    [BotDifficulty.ADVANCED, 0.05],
    [BotDifficulty.HARD, 0],
  ]);

  const value = jitterOptions.get(bot.difficulty) ?? 0;
  const angleOffset = (Math.random() - 0.5) * 2 * value;

  const currentAngle = Math.atan2(directionVector.x, directionVector.z);
  const newAngle = currentAngle + angleOffset;

  return create3DVector(
    Math.sin(newAngle),
    directionVector.y,
    Math.cos(newAngle),
  );
}

export function getBotPredictedMovement(): InputStateDto {
  return {
    w: false,
    a: false,
    s: false,
    d: false,
  };
}

export function getFireBulletDto(
  bot: Bot,
  botTank: Tank,
  directionVector: Vector3D,
): FireBulletDto {
  const direction = getBotAimingJitter(bot, directionVector);
  const rotation = Math.atan2(direction.x, direction.z);

  return {
    position: botTank.position,
    direction,
    rotation,
    playerMovement: getBotPredictedMovement(),
  };
}
