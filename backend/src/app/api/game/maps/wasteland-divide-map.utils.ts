import { GameMap } from '../../../common/models/game-map.model';
import { v4 as uuidv4 } from 'uuid';
import { Obstacle } from '../../../common/models/obstacle.model';
import { create3DVector, Vector3D } from '../../../common/models/vector.model';
import { Position } from '../../../common/models/position.model';
import { Scale } from '../../../common/models/scale.model';

export function getWastelandDivideMap(): GameMap {
  return {
    id: 'wastelanddivide',
    name: 'Wasteland Divide',
    pictureUrl: 'assets/pictures/map-wasteland-divide.png',
    scale: create3DVector(110, 100, 110),
    groundTexture: {
      id: uuidv4(),
      name: 'sandstone-cracks',
      diffuseImageUrl: 'assets/textures/sandstone_cracks_diff_1k.jpg',
      normalImageUrl: 'assets/textures/sandstone_cracks_nor_gl_1k.exr',
      roughnessImageUrl: 'assets/textures/sandstone_cracks_rough_1k.jpg',
      repeat: {
        x: 2,
        y: 2,
      },
    },
    teamEntryPoints: [
      {
        team: 1,
        point: [
          {
            position: create3DVector(15, 0, -15),
            rotation: 2 * Math.PI,
            cameraPosition: create3DVector(0, 70, -85),
          },
          {
            position: create3DVector(-15, 0, -15),
            rotation: Math.PI,
            cameraPosition: create3DVector(0, 70, -85),
          },
        ],
      },
      {
        team: 2,
        point: [
          {
            position: create3DVector(-15, 0, 15),
            rotation: Math.PI,
            cameraPosition: create3DVector(0, 70, 85),
          },
          {
            position: create3DVector(15, 0, 15),
            rotation: 2 * Math.PI,
            cameraPosition: create3DVector(0, 70, 85),
          },
        ],
      },
      {
        team: 3,
        point: [
          {
            position: create3DVector(-15, 0, -15),
            rotation: Math.PI,
            cameraPosition: create3DVector(0, 70, -85),
          },
        ],
      },
      {
        team: 4,
        point: [
          {
            position: create3DVector(15, 0, 15),
            rotation: 2 * Math.PI,
            cameraPosition: create3DVector(0, 70, 85),
          },
        ],
      },
    ],
    obstacles: [
      ...getDamagedWalls(),
      ...getCliffLandscape(),
      ...getDesertHouses(),
      ...getDesertBuildings(),
      ...getDesertMesas(),
      getDeadTrees(),
    ],
  };
}

export function getDamagedWalls(): Obstacle[] {
  return [
    getDamagedWall({
      position: create3DVector(0, 0, 0),
      scale: create3DVector(60, 6, 4),
      renderScale: create3DVector(0.15, 0.2, 0.2),
      rotation: create3DVector(0, 0, 0),
    }),
    getDamagedWall({
      position: create3DVector(0, 0, 0),
      scale: create3DVector(60, 6, 4),
      renderScale: create3DVector(0.15, 0.2, 0.2),
      rotation: create3DVector(0, Math.PI / 2, 0),
    }),
  ];
}

export function getDamagedWall({
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
    name: 'damaged-wall',
    modelUrl: 'assets/models/outdoor_stone_wall.glb',
    position,
    renderScale,
    scale,
    rotation,
  };
}

export function getCliffLandscape(): Obstacle[] {
  return [
    getCliff({
      position: create3DVector(-45, 12, 61),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 1.2 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(0, 12, 61),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 1.2 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(50, 12, 61),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 1.2 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(70, 12, 10),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 1.7 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(70, 12, -40),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 1.7 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(30, 12, -61),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 2.2 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(-30, 12, -61),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 2.2 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(-70, 12, -30),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 0.7 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(-70, 12, 30),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 0.7 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
  ];
}

export function getCliff({
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
    name: 'desert-house',
    modelUrl: 'assets/models/cliff.glb',
    position,
    renderScale,
    scale,
    rotation,
  };
}

export function getDesertHouses(): Obstacle[] {
  return [
    getDesertHouse({
      position: create3DVector(42, 4, 43),
      scale: create3DVector(8, 4, 10),
      renderScale: create3DVector(2, 2, 2),
      rotation: create3DVector(0, Math.PI * 1.5, 0),
    }),
    getDesertHouse({
      position: create3DVector(52, 3.3, 43),
      scale: create3DVector(8, 4, 10),
      renderScale: create3DVector(2, 2, 2),
      rotation: create3DVector(0, Math.PI / 2, 0),
    }),
    getDesertHouse({
      position: create3DVector(49, 3, 32),
      scale: create3DVector(8, 4, 10),
      renderScale: create3DVector(2, 2, 2),
      rotation: create3DVector(0, Math.PI * 1.25, 0),
    }),
    getDesertHouse({
      position: create3DVector(-49, 3.3, -35),
      scale: create3DVector(8, 4, 10),
      renderScale: create3DVector(2, 2, 2),
      rotation: create3DVector(0, Math.PI * 2, 0),
    }),
  ];
}

export function getDesertHouse({
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
    name: 'desert-house',
    modelUrl: 'assets/models/poor_desert_house.glb',
    position,
    renderScale,
    scale,
    rotation,
  };
}

export function getDesertBuildings(): Obstacle[] {
  return [
    getDesertBuilding({
      position: create3DVector(-36, 4, -40),
      scale: create3DVector(10, 4, 6),
      renderScale: create3DVector(2, 2, 2),
      rotation: create3DVector(0, Math.PI / 3, 0),
    }),
  ];
}

export function getDesertBuilding({
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
    name: 'desert-building',
    modelUrl: 'assets/models/old_building.glb',
    position,
    renderScale,
    scale,
    rotation,
  };
}

export function getDesertMesas(): Obstacle[] {
  return [
    getDesertMesa({
      position: create3DVector(-55, 4, 44),
      scale: create3DVector(10, 4, 10),
      renderScale: create3DVector(20, 40, 20),
      rotation: create3DVector(0, Math.PI / 3, 0),
    }),
    getDesertMesa({
      position: create3DVector(-50, 4, 48),
      scale: create3DVector(10, 4, 10),
      renderScale: create3DVector(20, 20, 20),
      rotation: create3DVector(0, Math.PI / 3, 0),
    }),
    getDesertMesa({
      position: create3DVector(-45, 2, 48),
      scale: create3DVector(8, 4, 8),
      renderScale: create3DVector(16, 20, 16),
      rotation: create3DVector(0, Math.PI / 3, 0),
    }),
    getDesertMesa({
      position: create3DVector(-52, 2, 52),
      scale: create3DVector(8, 4, 8),
      renderScale: create3DVector(16, 40, 16),
      rotation: create3DVector(0, Math.PI / 3, 0),
    }),
    getDesertMesa({
      position: create3DVector(-42, 5, 52),
      scale: create3DVector(8, 4, 8),
      renderScale: create3DVector(24, 30, 24),
      rotation: create3DVector(0, Math.PI / 3, 0),
    }),
  ];
}

export function getDesertMesa({
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
    name: 'desert-mesa',
    modelUrl: 'assets/models/desert_mesa.glb',
    position,
    renderScale,
    scale,
    rotation,
  };
}

export function getDeadTrees(): Obstacle {
  return {
    id: uuidv4(),
    name: 'dead-trees',
    modelUrl: 'assets/models/dead-trees-1.glb',
    position: create3DVector(53, 0, -45),
    renderScale: create3DVector(0.25, 0.25, 0.25),
    scale: create3DVector(12, 3, 12),
    rotation: create3DVector(0, 0, 0),
  };
}
