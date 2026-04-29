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

export function getDesertMap3(): GameMap {
  return {
    id: 'canyonclash',
    name: 'Canyon Clash',
    pictureUrl: 'assets/pictures/map-canyon-clash.png',
    scale: {
      x: 110,
      y: 110,
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
    // teamEntryPoints: [
    //   {
    //     team: 1,
    //
    //     point: [
    //       {
    //         position: {
    //           x: 0,
    //           y: 0,
    //           z: 43,
    //         },
    //         rotation: Math.PI,
    //         cameraPosition: {
    //           x: 0,
    //           y: 70,
    //           z: 85,
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     team: 2,
    //     point: [
    //       {
    //         position: {
    //           x: 0,
    //           y: 0,
    //           z: -43,
    //         },
    //         rotation: 0,
    //         cameraPosition: {
    //           x: 0,
    //           y: 70,
    //           z: -85,
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     team: 3,
    //     point: [
    //       {
    //         position: {
    //           x: -45,
    //           y: 0,
    //           z: 0,
    //         },
    //         rotation: Math.PI / 2,
    //         cameraPosition: {
    //           x: -85,
    //           y: 70,
    //           z: 0,
    //         },
    //       },
    //       {
    //         position: {
    //           x: 0,
    //           y: 0,
    //           z: -45,
    //         },
    //         rotation: 0,
    //         cameraPosition: {
    //           x: 0,
    //           y: 70,
    //           z: -85,
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     team: 4,
    //     point: [
    //       {
    //         position: {
    //           x: 45,
    //           y: 0,
    //           z: 0,
    //         },
    //         rotation: Math.PI * 1.5,
    //         cameraPosition: {
    //           x: 85,
    //           y: 70,
    //           z: 0,
    //         },
    //       },
    //       {
    //         position: {
    //           x: 0,
    //           y: 0,
    //           z: 45,
    //         },
    //         rotation: 0,
    //         cameraPosition: {
    //           x: 0,
    //           y: 70,
    //           z: 85,
    //         },
    //       },
    //     ],
    //   },
    // ],
    teamEntryPoints: getCornerTeamEntryPoints(),
    botTeamEntryPoints: getCornerBotTeamEntryPoints(),
    obstacles: [...getDamagedWalls(), ...getCliffLandscape()],
  };
}

export function getDamagedWalls(): Obstacle[] {
  return [
    getDamagedWall({
      position: {
        x: 0,
        y: 0,
        z: 33,
      },
      scale: {
        x: 25,
        y: 3,
        z: 4,
      },
      renderScale: {
        x: 0.075,
        y: 0.2,
        z: 0.083,
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
        z: -33,
      },
      scale: {
        x: 25,
        y: 3,
        z: 4,
      },
      renderScale: {
        x: 0.075,
        y: 0.2,
        z: 0.083,
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    }),
    getDamagedWall({
      position: {
        x: 33,
        y: 0,
        z: 0,
      },
      scale: {
        x: 25,
        y: 3,
        z: 4,
      },
      renderScale: {
        x: 0.075,
        y: 0.2,
        z: 0.083,
      },
      rotation: {
        x: 0,
        y: Math.PI / 2,
        z: 0,
      },
    }),
    getDamagedWall({
      position: {
        x: -33,
        y: 0,
        z: -0,
      },
      scale: {
        x: 25,
        y: 3,
        z: 4,
      },
      renderScale: {
        x: 0.075,
        y: 0.2,
        z: 0.083,
      },
      rotation: {
        x: 0,
        y: Math.PI / 2,
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
      position: create3DVector(-45, 12, 70),
      scale: create3DVector(0, 0, 0),
      rotation: create3DVector(0, 1.2 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(0, 12, 70),
      scale: create3DVector(0, 0, 0),
      rotation: create3DVector(0, 1.2 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(50, 12, 70),
      scale: create3DVector(0, 0, 0),
      rotation: create3DVector(0, 1.2 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(70, 12, 10),
      scale: create3DVector(0, 0, 0),
      rotation: create3DVector(0, 1.7 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(70, 12, -40),
      scale: create3DVector(0, 0, 0),
      rotation: create3DVector(0, 1.7 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(30, 12, -70),
      scale: create3DVector(0, 0, 0),
      rotation: create3DVector(0, 2.2 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(-30, 12, -70),
      scale: create3DVector(0, 0, 0),
      rotation: create3DVector(0, 2.2 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(-70, 12, -30),
      scale: create3DVector(0, 0, 0),
      rotation: create3DVector(0, 0.7 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(-70, 12, 30),
      scale: create3DVector(0, 0, 0),
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
