import { GameMap } from '../../../common/models/game-map.model';
import { v4 as uuidv4 } from 'uuid';
import { Obstacle } from '../../../common/models/obstacle.model';
import { Vector3D } from '../../../common/models/vector.model';
import { Position } from '../../../common/models/position.model';
import { Scale } from '../../../common/models/scale.model';
import { create3DVector } from '../../../common/utils/vector.utils';
import {
  getCornerBotTeamEntryPoints,
  getCornerTeamEntryPoints,
} from './team-entry-points.utils';

export function getContainerYardMap(): GameMap {
  return {
    id: 'containeryard',
    name: 'Container Yard',
    pictureUrl: 'assets/pictures/map-container-yard.png',
    scale: {
      x: 110,
      y: 100,
      z: 110,
    },
    groundTexture: {
      id: uuidv4(),
      name: 'asphalt',
      diffuseImageUrl: 'assets/textures/gravel_concrete_03_diff_1k.jpg',
      normalImageUrl: 'assets/textures/gravel_concrete_03_nor_gl_1k.exr',
      roughnessImageUrl: 'assets/textures/gravel_concrete_03_rough_1k.exr',
      repeat: {
        x: 2,
        y: 2,
      },
    },
    teamEntryPoints: getCornerTeamEntryPoints(),
    botTeamEntryPoints: getCornerBotTeamEntryPoints(),
    obstacles: [
      ...getContainerFronts(),
      getConstructionSite(),
      getContainerHome(),
      ...getContainers(),
    ],
  };
}

export function getContainers(): Obstacle[] {
  return [
    getContainer({
      position: create3DVector(66, 4, 50),
      scale: create3DVector(20, 6, 9),
      renderScale: create3DVector(0.2, 0.2, 0.2),
      rotation: create3DVector(0, 0, 0),
    }),
    getContainer({
      position: create3DVector(66, 10, 50),
      scale: create3DVector(20, 6, 9),
      renderScale: create3DVector(0.2, 0.2, 0.2),
      rotation: create3DVector(0, 0, 0),
    }),
    getContainer({
      position: create3DVector(66, 4, -50),
      scale: create3DVector(20, 6, 9),
      renderScale: create3DVector(0.2, 0.2, 0.2),
      rotation: create3DVector(0, 0, 0),
    }),
    getContainer({
      position: create3DVector(66, 10, -50),
      scale: create3DVector(20, 6, 9),
      renderScale: create3DVector(0.2, 0.2, 0.2),
      rotation: create3DVector(0, 0, 0),
    }),
    // getContainer({
    //   position: create3DVector(-47, 4, -30),
    //   scale: create3DVector(20, 6, 9),
    //   renderScale: create3DVector(0.2, 0.2, 0.2),
    //   rotation: create3DVector(0, Math.PI / 2, 0),
    // }),
    // getContainer({
    //   position: create3DVector(45, 4, 30),
    //   scale: create3DVector(20, 6, 9),
    //   renderScale: create3DVector(0.2, 0.2, 0.2),
    //   rotation: create3DVector(0, Math.PI / 2, 0),
    // }),
    getContainer({
      position: create3DVector(15, 4, 15),
      scale: create3DVector(20, 6, 9),
      renderScale: create3DVector(0.2, 0.2, 0.2),
      rotation: create3DVector(0, 0, 0),
    }),
    getContainer({
      position: create3DVector(13, 4, -13),
      scale: create3DVector(20, 6, 9),
      renderScale: create3DVector(0.2, 0.2, 0.2),
      rotation: create3DVector(0, 0, 0),
    }),
    getContainer({
      position: create3DVector(-13, 4, 13),
      scale: create3DVector(20, 6, 9),
      renderScale: create3DVector(0.2, 0.2, 0.2),
      rotation: create3DVector(0, 0, 0),
    }),
    getContainer({
      position: create3DVector(-13, 4, -13),
      scale: create3DVector(20, 6, 9),
      renderScale: create3DVector(0.2, 0.2, 0.2),
      rotation: create3DVector(0, 0, 0),
    }),
  ];
}

export function getContainer({
  position,
  renderScale,
  scale,
  rotation,
}: {
  position: Position;
  rotation: Vector3D;
  scale: Scale;
  renderScale: Scale;
}): Obstacle {
  return {
    id: uuidv4(),
    name: 'blue-container',
    modelUrl: 'assets/models/container.glb',
    position,
    renderScale,
    scale,
    rotation,
  };
}

export function getConstructionSite(): Obstacle {
  return {
    id: uuidv4(),
    name: 'construction-site',
    modelUrl: 'assets/models/container_construction_site.glb',
    position: create3DVector(62, 6, 0),
    renderScale: create3DVector(4, 4, 4),
    scale: create3DVector(85, 7, 20.2),
    rotation: create3DVector(0, Math.PI / 2, 0),
  };
}

export function getContainerHome(): Obstacle {
  return {
    id: uuidv4(),
    name: 'container-home',
    modelUrl: 'assets/models/container_home.glb',
    position: create3DVector(0, 7, 0),
    renderScale: create3DVector(1, 1, 1),
    scale: create3DVector(50, 7, 20.2),
    rotation: create3DVector(0, 0, 0),
  };
}

export function getContainerFronts(): Obstacle[] {
  return [
    getContainerFront({
      position: create3DVector(0, 8, 60),
      scale: create3DVector(100, 6, 15),
      renderScale: create3DVector(4, 4, 4),
      rotation: create3DVector(0, 0, 0),
    }),
    getContainerFront({
      position: create3DVector(-60, 8, 0),
      scale: create3DVector(100, 6, 15),
      renderScale: create3DVector(4, 4, 4),
      rotation: create3DVector(0, Math.PI / 2, 0),
    }),
    getContainerFront({
      position: create3DVector(0, 8, -60),
      scale: create3DVector(100, 6, 15),
      renderScale: create3DVector(4, 4, 4),
      rotation: create3DVector(0, 0, 0),
    }),
  ];
}

export function getContainerFront({
  position,
  renderScale,
  scale,
  rotation,
}: {
  position: Position;
  rotation: Vector3D;
  scale: Scale;
  renderScale: Scale;
}): Obstacle {
  return {
    id: uuidv4(),
    name: 'container-front',
    modelUrl: 'assets/models/container-front.glb',
    position,
    renderScale,
    scale,
    rotation,
  };
}
