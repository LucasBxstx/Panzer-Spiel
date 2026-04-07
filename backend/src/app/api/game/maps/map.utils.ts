import {
  ChunkData,
  GameMap,
  Mesh,
} from '../../../common/models/game-map.model';
import { getDesertBarricadeMap } from './desert-barricade-map.utils';
import { getWastelandDivideMap } from './wasteland-divide-map.utils';
import { getDesertMap3 } from './canyon-clash-map.utils';
import { getContainerYardMap } from './container-yard.utils';
import { getContainerHubMap } from './container-hub-map.utils';
import { getContainerPortMap } from './container-port-map.utils';
import { Position } from '../../../common/models/position.model';
import { checkCollision, CollisionObject } from '../collision';
import {
  create3DVector,
  getVectorMagnitude,
  subtractVectors,
} from '../../../common/utils/vector.utils';

export function getAllMaps(): GameMap[] {
  return [
    getContainerYardMap(),
    getContainerHubMap(),
    getContainerPortMap(),
    getDesertBarricadeMap(),
    getWastelandDivideMap(),
    getDesertMap3(),
  ];
}

export function findMap(id: string): GameMap | undefined {
  const maps = getAllMaps();

  return maps.find((m) => m.id === id);
}

export interface Chunk {
  id: string;
  x: number;
  z: number;
  neighborIds: string[];
  pathFromChunkId?: string;
}

export function generateMapMesh(map: GameMap) {
  const CHUNK_SIZE = 5;
  const chunkData = getChunkData(map, CHUNK_SIZE);
  const chunks = splitMapIntoChunks(map, chunkData);

  generateChunkNeighbors(chunks, chunkData);
  map.mesh = { chunks, chunkData };
}

export function generateChunkNeighbors(
  chunks: Map<string, Chunk>,
  { NUM_CHUNKS_X, NUM_CHUNKS_Z }: ChunkData,
) {
  for (let z = 0; z < NUM_CHUNKS_Z; z++) {
    for (let x = 0; x < NUM_CHUNKS_X; x++) {
      const chunk = chunks.get(getChunkId(x, z));

      if (!chunk) continue;

      if (z + 1 < NUM_CHUNKS_Z) {
        const upperNeighbor = chunks.get(getChunkId(x, z + 1));
        if (upperNeighbor) chunk.neighborIds.push(upperNeighbor.id);
      }

      if (z - 1 > 0) {
        const lowerNeighbor = chunks.get(getChunkId(x, z - 1));
        if (lowerNeighbor) chunk.neighborIds.push(lowerNeighbor.id);
      }

      if (x + 1 < NUM_CHUNKS_X) {
        const rightNeighbor = chunks.get(getChunkId(x + 1, z));
        if (rightNeighbor) chunk.neighborIds.push(rightNeighbor.id);
      }

      if (x - 1 < NUM_CHUNKS_X) {
        const leftNeighbor = chunks.get(getChunkId(x - 1, z));
        if (leftNeighbor) chunk.neighborIds.push(leftNeighbor.id);
      }
    }
  }
}

export function getChunkData(map: GameMap, CHUNK_SIZE: number) {
  const HALF_CHUNK_SIZE = CHUNK_SIZE / 2;
  const NUM_CHUNKS_X = map.scale.x / CHUNK_SIZE;
  const NUM_CHUNKS_Z = map.scale.z / CHUNK_SIZE;
  const xMIN = map.scale.x * -0.5;
  const zMIN = map.scale.z * -0.5;

  return {
    CHUNK_SIZE,
    HALF_CHUNK_SIZE,
    NUM_CHUNKS_X,
    NUM_CHUNKS_Z,
    xMIN,
    zMIN,
  };
}

export function splitMapIntoChunks(
  map: GameMap,
  {
    CHUNK_SIZE,
    HALF_CHUNK_SIZE,
    NUM_CHUNKS_X,
    NUM_CHUNKS_Z,
    xMIN,
    zMIN,
  }: ChunkData,
): Map<string, Chunk> {
  const chunks: Map<string, Chunk> = new Map();

  for (let z = 0; z < NUM_CHUNKS_Z; z++) {
    for (let x = 0; x < NUM_CHUNKS_X; x++) {
      const chunkStartX = xMIN + x * CHUNK_SIZE;
      const chunkStartZ = zMIN + z * CHUNK_SIZE;

      const position: Position = {
        x: chunkStartX + HALF_CHUNK_SIZE,
        y: HALF_CHUNK_SIZE,
        z: chunkStartZ + HALF_CHUNK_SIZE,
      };

      const chunkCollisionObject: CollisionObject = {
        position,
        scale: create3DVector(CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE),
        rotation: create3DVector(0, 0, 0),
      };

      let hasObstacle = false;

      for (const obstacle of map.obstacles) {
        // We increase the scale of the obstacles by the size of a tank
        const obstacleScaledUp = structuredClone(obstacle);
        obstacleScaledUp.scale = {
          x: obstacle.scale.x + 10,
          y: obstacle.scale.y,
          z: obstacle.scale.z + 10,
        };

        if (checkCollision(chunkCollisionObject, obstacleScaledUp)) {
          hasObstacle = true;
          break;
        }
      }

      if (!hasObstacle) {
        const id = getChunkId(x, z);
        chunks.set(id, {
          id,
          x,
          z,
          neighborIds: [],
        });
      }
    }
  }

  printMesh(chunks, NUM_CHUNKS_X, NUM_CHUNKS_Z);

  return chunks;
}

function printMesh(
  chunks: Map<string, Chunk>,
  NUM_CHUNKS_X: number,
  NUM_CHUNKS_Z: number,
) {
  let firstRow = '';
  for (let i = 0; i < NUM_CHUNKS_X + 2; i++) {
    firstRow += 'x';
  }
  console.log(firstRow);
  for (let z = 0; z < NUM_CHUNKS_Z; z++) {
    let row = 'x';
    for (let x = 0; x < NUM_CHUNKS_X; x++) {
      row += chunks.get(getChunkId(x, z)) ? ' ' : 'x';
    }
    row += 'x';
    console.log(row);
  }
  console.log(firstRow);
}

export function getChunkId(x: number, z: number): string {
  return `${x}-${z}`;
}

export function getChunkIndices(id: string): { x: number; z: number } {
  const values = id.split('-');

  return {
    x: Number(values[0]),
    z: Number(values[1]),
  };
}

export function getChunkByPosition(
  mesh: Mesh,
  position: Position,
): Chunk | undefined {
  const chunkId = convertPositionToChunkId(position, mesh.chunkData);
  return mesh.chunks.get(chunkId);
}

export function getDistanceBetweenChunks(
  a: Chunk,
  b: Chunk,
  chunkData: ChunkData,
): number {
  const aPosition = convertChunkToPosition(a.id, chunkData);
  const bPosition = convertChunkToPosition(b.id, chunkData);
  const directionVector = subtractVectors(bPosition, aPosition);
  return getVectorMagnitude(directionVector);
}

export function convertPositionToChunkId(
  position: Position,
  { CHUNK_SIZE, zMIN, xMIN }: ChunkData,
): string {
  const x = Math.round((position.x - xMIN) / CHUNK_SIZE);
  const z = Math.round((position.z - zMIN) / CHUNK_SIZE);

  return getChunkId(x, z);
}

export function convertChunkToPosition(
  chunkId: string,
  { CHUNK_SIZE, zMIN, xMIN }: ChunkData,
): Position {
  const { x, z } = getChunkIndices(chunkId);

  return {
    x: xMIN + x * CHUNK_SIZE,
    y: CHUNK_SIZE / 2,
    z: zMIN + z * CHUNK_SIZE,
  };
}
