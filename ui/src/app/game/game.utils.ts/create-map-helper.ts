import { ObstacleResponse } from '../../shared/models/obstacle.model';
import { create3DVector, Position, Scale, Vector3D } from '../../shared/models/vector.model';

export function getDesertMesaLandscape(): ObstacleResponse[] {
  return [
    getDesertMesa({
      position: create3DVector(50, 6, 0),
      scale: create3DVector(20, 20, 20),
      rotation: create3DVector(0, 0, 0),
      renderScale: create3DVector(20, 20, 20),
    }),
    getDesertMesa({
      position: create3DVector(0, 6, -75),
      scale: create3DVector(80, 20, 40),
      rotation: create3DVector(0, 0, 0),
      renderScale: create3DVector(80, 20, 40),
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
}): ObstacleResponse {
  return {
    id: 'a',
    name: 'desert-mesa',
    modelUrl: 'assets/models/desert_mesa.glb',
    position,
    scale,
    rotation,
    renderScale,
  };
}

export function getCliffLandscape(): ObstacleResponse[] {
  return [
    getCliff({
      position: create3DVector(65, 12, 10),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 1.7 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(60, 12, -40),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 1.8 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(20, 12, -80),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 2 * Math.PI, 0),
      renderScale: create3DVector(0.8, 0.8, 0.8),
    }),
    getCliff({
      position: create3DVector(-30, 12, -70),
      scale: create3DVector(20, 0, 20),
      rotation: create3DVector(0, 2.3 * Math.PI, 0),
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
