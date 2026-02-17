import { Obstacle } from './obstacle.model';
import { Scale } from './scale.model';
import { Texture } from './texture.model';
import { Position } from './position.model';

export interface GameMap {
  id: string;
  name: string;
  pictureUrl: string;
  obstacles: Obstacle[];
  teamEntryPoints: TeamEntryPoints[];
  scale: Scale;
  groundTexture: Texture;
}

export interface TeamEntryPoints {
  team: number;
  positions: Position[];
}
