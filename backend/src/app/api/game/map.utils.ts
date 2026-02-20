import { GameMap } from '../../common/models/game-map.model';
import { v4 as uuidv4 } from 'uuid';
import { Texture } from '../../common/models/texture.model';
import { Obstacle } from '../../common/models/obstacle.model';
import { create3DVector, Vector3D } from '../../common/models/vector.model';
import { Position } from '../../common/models/position.model';
import { Scale } from '../../common/models/scale.model';

export function getDesertMap(): GameMap {
  return {
    id: uuidv4(),
    name: 'Desert',
    pictureUrl: 'assets/pictures/map-desert.png',
    scale: {
      x: 100,
      y: 100,
      z: 100,
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
              x: -40,
              y: 0,
              z: -40,
            },
            rotation: 2 * Math.PI,
          },
        ],
      },
      {
        team: 2,
        point: [
          {
            position: {
              x: 40,
              y: 0,
              z: 40,
            },
            rotation: Math.PI,
          },
        ],
      },
    ],
    obstacles: [getDamagedWall(), ...getSandHillLandscale()],
  };
}

export function getBrickTexture(): Texture {
  return {
    id: uuidv4(),
    name: 'Brick',
    diffuseImageUrl: 'assets/textures/broken_brick_wall_diff_1k.jpg',
    normalImageUrl: 'assets/textures/broken_brick_wall_nor_gl_1k.png',
    roughnessImageUrl: 'assets/textures/broken_brick_wall_rough_1k.jpg',
    repeat: { x: 5, y: 1 },
  };
}

export function getWall(): Obstacle {
  return {
    id: '1',
    name: 'Wall',
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    scale: {
      x: 20,
      y: 20,
      z: 30,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    renderScale: {
      x: 20,
      y: 20,
      z: 30,
    },
    texture: getBrickTexture(),
  };
}

export function getDamagedWall(): Obstacle {
  return {
    id: uuidv4(),
    name: 'damaged-wall',
    modelUrl: 'assets/models/damaged_wall.glb',
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    scale: {
      x: 20,
      y: 20,
      z: 30,
    },
    renderScale: {
      x: 0.1,
      y: 0.1,
      z: 0.1,
    },
    rotation: {
      x: 0,
      y: 0.3 * Math.PI,
      z: 0,
    },
  };
}

export function getSandHillLandscale(): Obstacle[] {
  return [
    getSandHill({
      position: create3DVector(50, 6, 0),
      scale: create3DVector(20, 20, 20),
      rotation: create3DVector(0, 0, 0),
      renderScale: create3DVector(20, 20, 20),
    }),
    getSandHill({
      position: create3DVector(0, 6, 50),
      scale: create3DVector(80, 20, 40),
      rotation: create3DVector(0, 0, 0),
      renderScale: create3DVector(80, 20, 40),
    }),
  ];
}

export function getSandHill({
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
    modelUrl: 'assets/models/sand_hill.glb',
    position,
    scale,
    rotation,
    renderScale,
  };
}
