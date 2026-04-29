import { Obstacle } from './obstacle.model';
import { Scale } from './scale.model';
import { Texture } from './texture.model';
import { Position } from './position.model';
import { Chunk } from '../../api/game/maps/map.utils';

export interface GameMap {
  id: string;
  name: string;
  pictureUrl: string;
  obstacles: Obstacle[];
  teamEntryPoints: TeamEntryPoints[];
  botTeamEntryPoints?: TeamEntryPoints[];
  scale: Scale;
  groundTexture: Texture;
  mesh?: Mesh;
}

export interface Mesh {
  chunks: Map<string, Chunk>;
  chunkData: ChunkData;
}

export interface ChunkData {
  CHUNK_SIZE: number;
  HALF_CHUNK_SIZE: number;
  NUM_CHUNKS_X: number;
  NUM_CHUNKS_Z: number;
  xMIN: number;
  zMIN: number;
}

export interface TeamEntryPoints {
  team: number;
  point: EntryPoint[];
}

export interface EntryPoint {
  rotation: number;
  position: Position;
  cameraPosition: Position;
}
