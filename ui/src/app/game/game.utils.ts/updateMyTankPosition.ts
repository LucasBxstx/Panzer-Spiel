import * as THREE from 'three';
import { isRotationNear, shortestRotation } from './updateMyTurretRotation';
import { TankGroup, TankProps } from '../../shared/models/tank.model';
import { KeyboardInputService } from '../../shared/services/keyboard-input.service';

export function updateMyTankPosition(
  myTank: TankGroup,
  myTankProps: TankProps | null,
  keyboard: KeyboardInputService,
) {
  if (!myTankProps) return;

  const moveDirection = new THREE.Vector3();
  let targetRotation: number | null = null;

  if (keyboard.isKeyPressed('KeyW')) {
    moveDirection.z -= 1;
    if (!isRotationNear(myTank.tankGroup.rotation.y, 0)) {
      targetRotation = Math.PI;
    }
  }

  if (keyboard.isKeyPressed('KeyS')) {
    moveDirection.z += 1;
    if (!isRotationNear(myTank.tankGroup.rotation.y, Math.PI)) {
      targetRotation = 0;
    }
  }

  if (keyboard.isKeyPressed('KeyA')) {
    moveDirection.x -= 1;
    if (!isRotationNear(myTank.tankGroup.rotation.y, Math.PI / 2)) {
      targetRotation = Math.PI * 1.5;
    }
  }

  if (keyboard.isKeyPressed('KeyD')) {
    moveDirection.x += 1;
    if (!isRotationNear(myTank.tankGroup.rotation.y, Math.PI * 1.5)) {
      targetRotation = Math.PI / 2;
    }
  }

  if (keyboard.isKeyPressed('KeyW') && keyboard.isKeyPressed('KeyA')) {
    targetRotation = Math.PI * 1.25;
  } else if (keyboard.isKeyPressed('KeyW') && keyboard.isKeyPressed('KeyD')) {
    targetRotation = Math.PI * 0.75;
  } else if (keyboard.isKeyPressed('KeyS') && keyboard.isKeyPressed('KeyA')) {
    targetRotation = Math.PI * 1.75;
  } else if (keyboard.isKeyPressed('KeyS') && keyboard.isKeyPressed('KeyD')) {
    targetRotation = Math.PI * 0.25;
  }

  if (targetRotation !== null) {
    const diff = shortestRotation(myTank.tankGroup.rotation.y, targetRotation);
    myTank.tankGroup.rotation.y += diff * myTankProps.rotationSpeed;
  }

  if (moveDirection.length() > 0) {
    moveDirection.normalize();
    myTank.tankGroup.position.x += moveDirection.x * myTankProps.speed;
    myTank.tankGroup.position.z += moveDirection.z * myTankProps.speed;
  }
}
