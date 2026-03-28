import { GameMap } from '../../../common/models/game-map.model';
import { v4 as uuidv4 } from 'uuid';
import { Obstacle } from '../../../common/models/obstacle.model';
import { Vector3D } from '../../../common/models/vector.model';
import { Position } from '../../../common/models/position.model';
import { Scale } from '../../../common/models/scale.model';
import { create3DVector } from '../../../common/utils/vector.utils';

export function getContainerHubMap(): GameMap {
  return {
    id: 'containerhub',
    name: 'Container Hub',
    pictureUrl: 'assets/pictures/map-container-hub.png',
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
    teamEntryPoints: [
      {
        team: 1,
        point: [
          {
            position: create3DVector(40, 0, -40),
            rotation: 2 * Math.PI,
            cameraPosition: create3DVector(0, 70, -85),
          },
          {
            position: create3DVector(-40, 0, -40),
            rotation: Math.PI,
            cameraPosition: create3DVector(0, 70, -85),
          },
        ],
      },
      {
        team: 2,
        point: [
          {
            position: create3DVector(-40, 0, 40),
            rotation: Math.PI,
            cameraPosition: create3DVector(0, 70, 85),
          },
          {
            position: create3DVector(40, 0, 40),
            rotation: 2 * Math.PI,
            cameraPosition: create3DVector(0, 70, 85),
          },
        ],
      },
      {
        team: 3,
        point: [
          {
            position: create3DVector(-40, 0, -40),
            rotation: Math.PI,
            cameraPosition: create3DVector(0, 70, -85),
          },
        ],
      },
      {
        team: 4,
        point: [
          {
            position: create3DVector(40, 0, 40),
            rotation: 2 * Math.PI,
            cameraPosition: create3DVector(0, 70, 85),
          },
        ],
      },
    ],
    obstacles: [...getContainerFronts(), ...getContainers()],
  };
}

export function getContainers(): Obstacle[] {
  return [
    // getContainer({
    //   position: create3DVector(-45, 4, 25),
    //   scale: create3DVector(20, 6, 9),
    //   renderScale: create3DVector(0.2, 0.2, 0.2),
    //   rotation: create3DVector(0, 0, 0),
    // }),
    // getContainer({
    //   position: create3DVector(45, 4, 25),
    //   scale: create3DVector(20, 6, 9),
    //   renderScale: create3DVector(0.2, 0.2, 0.2),
    //   rotation: create3DVector(0, 0, 0),
    // }),
    // getContainer({
    //   position: create3DVector(-45, 4, -25),
    //   scale: create3DVector(20, 6, 9),
    //   renderScale: create3DVector(0.2, 0.2, 0.2),
    //   rotation: create3DVector(0, 0, 0),
    // }),
    // getContainer({
    //   position: create3DVector(45, 4, -25),
    //   scale: create3DVector(20, 6, 9),
    //   renderScale: create3DVector(0.2, 0.2, 0.2),
    //   rotation: create3DVector(0, 0, 0),
    // }),
    getContainer({
      position: create3DVector(-10, 4, 0),
      scale: create3DVector(20, 6, 9),
      renderScale: create3DVector(0.2, 0.2, 0.2),
      rotation: create3DVector(0, 0, 0),
    }),
    getContainer({
      position: create3DVector(10, 4, 0),
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
      position: create3DVector(60, 8, 0),
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
