import { GameMap } from '../../../common/models/game-map.model';
import { getDesertBarricadeMap } from './desert-barricade-map.utils';
import { getWastelandDivideMap } from './wasteland-divide-map.utils';
import { getDesertMap3 } from './canyon-clash-map.utils';
import { getContainerYardMap } from './container-yard.utils';
import { getContainerHubMap } from './container-hub-map.utils';
import { getContainerPortMap } from './container-port-map.utils';

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
