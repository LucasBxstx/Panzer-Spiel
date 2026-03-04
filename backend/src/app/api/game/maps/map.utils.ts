import { GameMap } from '../../../common/models/game-map.model';
import { getDesertBarricadeMap } from './desert-barricade-map.utils';
import { getWastelandDivideMap } from './wasteland-divide-map.utils';
import { getDesertMap3 } from './desert-map-3.utils';
import { getContainerMap } from './container-map.utils';

export function getAllMaps(): GameMap[] {
  return [
    getDesertBarricadeMap(),
    getWastelandDivideMap(),
    getDesertMap3(),
    getContainerMap(),
  ];
}

export function findMap(id: string): GameMap | undefined {
  const maps = getAllMaps();

  return maps.find((m) => m.id === id);
}
