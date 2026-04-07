import { Bot, BotDifficulty } from '../../common/models/bot.model';
import { Game } from '../../common/models/game.model';
import { Tank } from '../../common/models/tank.model';
import { Position } from '../../common/models/position.model';
import { Vector3D } from '../../common/models/vector.model';
import {
  InputStateDto,
  UpdateTankPositionDto,
} from './webservice/dto/update-tank-position.dto';
import { FireBulletDto } from './webservice/dto/fire-bullet.dto';
import { checkCollision, CollisionObject } from './collision';
import {
  addVectors,
  create3DVector,
  getVectorMagnitude,
  multiplyVector,
  normalizeInPlace,
  subtractVectors,
} from '../../common/utils/vector.utils';
import { ChunkData, Mesh } from '../../common/models/game-map.model';
import {
  Chunk,
  convertChunkToPosition,
  convertPositionToChunkId,
  getChunkByPosition,
  getChunkId,
  getDistanceBetweenChunks,
} from './maps/map.utils';
import { MinPriorityQueue } from '@datastructures-js/priority-queue'; // We basically create a collision object that acts like a bullet, which is spanned between bot and enemy tank.

// We basically create a collision object that acts like a bullet, which is spanned between bot and enemy tank.
// And then we check for collision with this object that is the shootingLine, with other obstacles
export function hasClearShootLine(
  botTank: Tank,
  targetTank: Tank,
  game: Game,
): boolean {
  const directionVector = subtractVectors(
    targetTank.position,
    botTank.position,
  );

  // We set the position to be the coordinate between the bot and the enemy tank. Namely the center
  const position = multiplyVector(
    addVectors(botTank.position, targetTank.position),
    0.5,
  );
  const scale = create3DVector(1, 1, getVectorMagnitude(directionVector));
  const rotation = create3DVector(
    0,
    Math.atan2(directionVector.x, directionVector.z),
    0,
  );

  const shootLine: CollisionObject = {
    position,
    rotation,
    scale,
  };

  const obstacles = Array.from(game.gameSettings.map.obstacles.values());
  for (const obstacle of obstacles) {
    if (checkCollision(shootLine, obstacle)) {
      return false;
    }
  }

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
  const directionVector = subtractVectors(
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

export function determinePathToTargetPosition(
  mesh: Mesh,
  startPosition: Position,
  targetPosition: Position,
): Chunk[] {
  console.log('determinePathToTargetPosition');
  if (mesh.chunks.size === 0) return [];

  const startChunk = getChunkByPosition(mesh, startPosition);
  const targetChunk = getChunkByPosition(mesh, targetPosition);

  if (!startChunk || !targetChunk) return [];

  return findShortestWay(mesh, startChunk, targetChunk);
}

function findShortestWay(MESH: Mesh, start: Chunk, target: Chunk): Chunk[] {
  const visited = new Set<string>();
  const inQueue = new Set<string>();
  const queue = new MinPriorityQueue<{ id: string; priority: number }>(
    (item) => item.priority,
  );
  const mesh = structuredClone(MESH);

  let reachedTarget = false;

  const shortestPath = (current: Chunk, target: Chunk) => {
    visited.add(current.id);

    if (current.id == target.id) {
      reachedTarget = true;
      return;
    }

    current.neighborIds.forEach((neighborId) => {
      const neighbor = mesh.chunks.get(neighborId);
      const alreadyVisited = visited.has(neighborId);
      const alreadyQueued = inQueue.has(neighborId);

      if (!neighbor || alreadyVisited || alreadyQueued) return;

      const distance = getDistanceBetweenChunks(
        neighbor,
        target,
        mesh.chunkData,
      );

      queue.enqueue({ id: neighbor.id, priority: distance });
      neighbor.pathFromChunkId = current.id;
      inQueue.add(neighborId);
    });
  };

  // Add the start chunk to the queue
  queue.enqueue({ id: start.id, priority: 0 });
  inQueue.add(start.id);

  while (!reachedTarget && queue.size() > 0) {
    const nextQueued = queue.dequeue();

    if (!nextQueued) break;

    const nextChunk = mesh.chunks.get(nextQueued.id);
    if (!nextChunk) continue;

    shortestPath(nextChunk, target);
  }

  // Reconstruct the path
  const path = reconstructPath(mesh, start, target);
  const straightenedPath = straightenPath(path);

  printPath(
    straightenedPath,
    mesh.chunks,
    start,
    target,
    mesh.chunkData.NUM_CHUNKS_X,
    mesh.chunkData.NUM_CHUNKS_Z,
  );

  return straightenedPath;
}

function reconstructPath(mesh: Mesh, start: Chunk, target: Chunk): Chunk[] {
  const path: Chunk[] = [];
  let currentChunk: Chunk | undefined = mesh.chunks.get(target.id);

  while (
    currentChunk &&
    (currentChunk.id !== start.id || currentChunk.pathFromChunkId)
  ) {
    path.push(currentChunk);
    currentChunk = mesh.chunks.get(currentChunk.pathFromChunkId!);
  }

  return path.reverse();
}

function straightenPath(path: Chunk[]): Chunk[] {
  if (path.length <= 2) return path;

  for (let i = 0; i < path.length - 2; i++) {
    const current = path[i];

    // Remove next chunk if it is between two diagonal chunks
    if (
      Math.abs(path[i + 2].x - current.x) === 1 &&
      Math.abs(path[i + 2].z - current.z) === 1
    ) {
      path.splice(i + 1, 1);
    }
  }

  return path;
}

function printPath(
  chunks: Chunk[],
  obstacles: Map<string, Chunk>,
  start: Chunk,
  target: Chunk,
  NUM_CHUNKS_X: number,
  NUM_CHUNKS_Z: number,
) {
  const pathMap: Map<string, Chunk> = new Map(chunks.map((c) => [c.id, c]));
  let firstRow = '';
  for (let i = 0; i < NUM_CHUNKS_X + 2; i++) {
    firstRow += 'x';
  }
  console.log(firstRow);

  for (let z = 0; z < NUM_CHUNKS_Z; z++) {
    let row = 'x';
    for (let x = 0; x < NUM_CHUNKS_X; x++) {
      const chunkID = getChunkId(x, z);
      if (chunkID === start.id) {
        row += 's';
      } else if (chunkID === target.id) {
        row += 't';
      } else {
        row += pathMap.get(chunkID) ? 'o' : obstacles.get(chunkID) ? ' ' : 'x';
      }
    }
    row += 'x';
    console.log(row);
  }
  console.log(firstRow);
}

export function canUpdateDestination(bot: Bot): boolean {
  const now = new Date();
  const lastUpdate = new Date(bot.lastDestinationUpdate);

  return now.getTime() - lastUpdate.getTime() > bot.destinationBufferMS;
}

export function getBotPositionUpdateRequest(
  botTank: Tank,
  bot: Bot,
  chunkData: ChunkData,
): UpdateTankPositionDto {
  const nextChunkId = bot.nextDestinations[0].id;
  const botChunkId = convertPositionToChunkId(botTank.position, chunkData);

  if (botChunkId === nextChunkId) {
    bot.nextDestinations.shift();
  }

  const targetPosition = convertChunkToPosition(nextChunkId, chunkData);
  const startPosition = convertChunkToPosition(botChunkId, chunkData);
  const directionVector = subtractVectors(startPosition, targetPosition);

  const input: InputStateDto = {
    w: directionVector.z < 0,
    a: directionVector.x < 0,
    s: directionVector.z > 0,
    d: directionVector.x > 0,
  };

  return {
    seq: 0,
    input,
    timestamp: new Date().getTime(),
  };
}
