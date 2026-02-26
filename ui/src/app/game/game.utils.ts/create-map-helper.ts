import { ObstacleResponse } from '../../shared/models/obstacle.model';
import { create3DVector, Position, Scale, Vector3D } from '../../shared/models/vector.model';
import { TextureResponse } from '../../shared/models/texture.model';

export function getCliffLandscape(): ObstacleResponse[] {
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
      position: create3DVector(30, 12, -70),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 2.1 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(-30, 12, -70),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 2.2 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(-70, 12, -30),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 0.6 * Math.PI, 0),
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
}): ObstacleResponse {
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

export function getWalls(): ObstacleResponse[] {
  return [
    getWall({
      position: create3DVector(0, 0, 0),
      scale: create3DVector(8, 15, 30),
      rotation: create3DVector(0, 0, 0),
    }),
    getWall({
      position: create3DVector(-15, 0, 0),
      scale: create3DVector(8, 15, 30),
      rotation: create3DVector(0, 1.5 * Math.PI, 0),
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
}): ObstacleResponse {
  return {
    id: 'ab',
    name: 'stone-wall',
    texture: getStoneWallTexture(),
    position,
    renderScale: scale,
    scale,
    rotation,
  };
}

export function getStoneWallTexture(): TextureResponse {
  return {
    id: 'c',
    name: 'Brick',
    diffuseImageUrl: 'assets/textures/old_stone_wall_diff_1k.jpg',
    normalImageUrl: 'assets/textures/old_stone_wall_nor_gl_1k.png',
    roughnessImageUrl: 'assets/textures/old_stone_wall_rough_1k.exr',
    repeat: { x: 20, y: 20 },
  };
}
