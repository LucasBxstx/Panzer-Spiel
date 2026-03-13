import { GameMap } from '../../../common/models/game-map.model';
import { getDesertBarricadeMap } from './desert-barricade-map.utils';
import { getWastelandDivideMap } from './wasteland-divide-map.utils';
import { getDesertMap3 } from './canyon-clash-map.utils';
import { getContainerMap } from './container-map.utils';
import { getContainerHubMap } from './container-hub-map.utils';
import { getContainerPortMap } from './container-port-map.utils';

export function getAllMaps(): GameMap[] {
  return [
    getContainerMap(),
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
