import { GameMap } from '../../../common/models/game-map.model';
import { getDesertMap } from './desert-map-1.utils';
import { getDesertMap2 } from './desert-map-2.utils';
import { getDesertMap3 } from './desert-map-3.utils';

export function getAllMaps(): GameMap[] {
  return [getDesertMap(), getDesertMap2(), getDesertMap3()];
}

export function findMap(id: string): GameMap | undefined {
  const maps = getAllMaps();

  return maps.find((m) => m.id === id);
}
