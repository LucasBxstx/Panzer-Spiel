import { GameMap } from '../../../common/models/game-map.model';
import { v4 as uuidv4 } from 'uuid';
import { Obstacle } from '../../../common/models/obstacle.model';
import { Vector3D } from '../../../common/models/vector.model';
import { Position } from '../../../common/models/position.model';
import { Scale } from '../../../common/models/scale.model';
import { Texture } from '../../../common/models/texture.model';
import { create3DVector } from '../../../common/utils/vector.utils';

export function getDesertBarricadeMap(): GameMap {
  return {
    id: 'desertbarricade',
    name: 'Desert Barricade',
    pictureUrl: 'assets/pictures/map-desert-barricade.png',
    scale: {
      x: 110,
      y: 100,
      z: 110,
    },
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
            position: {
              x: 40,
              y: 0,
              z: -40,
            },
            rotation: 2 * Math.PI,
            cameraPosition: {
              x: 0,
              y: 70,
              z: -85,
            },
          },
          {
            position: {
              x: -40,
              y: 0,
              z: -40,
            },
            rotation: Math.PI,
            cameraPosition: {
              x: 0,
              y: 70,
              z: -85,
            },
          },
        ],
      },
      {
        team: 2,
        point: [
          {
            position: {
              x: -40,
              y: 0,
              z: 40,
            },
            rotation: Math.PI,
            cameraPosition: {
              x: 0,
              y: 70,
              z: 85,
            },
          },
          {
            position: {
              x: 40,
              y: 0,
              z: 40,
            },
            rotation: 2 * Math.PI,
            cameraPosition: {
              x: 0,
              y: 70,
              z: 85,
            },
          },
        ],
      },
      {
        team: 3,
        point: [
          {
            position: {
              x: -40,
              y: 0,
              z: -40,
            },
            rotation: Math.PI,
            cameraPosition: {
              x: 0,
              y: 70,
              z: -85,
            },
          },
        ],
      },
      {
        team: 4,
        point: [
          {
            position: {
              x: 40,
              y: 0,
              z: 40,
            },
            rotation: 2 * Math.PI,
            cameraPosition: {
              x: 0,
              y: 70,
              z: 85,
            },
          },
        ],
      },
    ],
    obstacles: [
      ...getDamagedWalls(),
      // ...getWalls(),
      ...getCliffLandscape(),
      // ...getSandHillLandscale(),
    ],
  };
}

export function getWalls(): Obstacle[] {
  return [
    getWall({
      position: create3DVector(0, 5, 30),
      scale: create3DVector(60, 10, 6),
      rotation: create3DVector(0, 0, 0),
    }),
    getWall({
      position: create3DVector(0, 5, -30),
      scale: create3DVector(60, 10, 6),
      rotation: create3DVector(0, 0, 0),
    }),
  ];
}

export function getWall({
  position,
  scale,
  rotation,
}: {
  position: Position;
  scale: Scale;
  rotation: Vector3D;
}): Obstacle {
  return {
    id: uuidv4(),
    name: 'stone-wall',
    texture: getStoneWallTexture(),
    position,
    renderScale: scale,
    scale,
    rotation,
  };
}

export function getStoneWallTexture(): Texture {
  return {
    id: uuidv4(),
    name: 'Brick',
    diffuseImageUrl: 'assets/textures/old_stone_wall_diff_1k.jpg',
    normalImageUrl: 'assets/textures/old_stone_wall_nor_gl_1k.png',
    roughnessImageUrl: 'assets/textures/old_stone_wall_rough_1k.exr',
    repeat: { x: 20, y: 20 },
  };
}

export function getDamagedWalls(): Obstacle[] {
  return [
    getDamagedWall({
      position: {
        x: 0,
        y: 0,
        z: -27,
      },
      scale: {
        x: 60,
        y: 6,
        z: 4,
      },
      renderScale: {
        x: 0.15,
        y: 0.2,
        z: 0.2,
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    }),
    getDamagedWall({
      position: {
        x: 0,
        y: 0,
        z: 27,
      },
      scale: {
        x: 60,
        y: 6,
        z: 4,
      },
      renderScale: {
        x: 0.15,
        y: 0.2,
        z: 0.2,
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
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
    id: 'ab',
    name: 'desert-house',
    modelUrl: 'assets/models/cliff.glb',
    position,
    renderScale,
    scale,
    rotation,
  };
}
