import { InputState, TankGroup, TankPosition, TankProps } from '../../shared/models/tank.model';
import { KeyboardInputService } from '../../shared/services/keyboard-input.service';
import { applyInput } from './applyInput';

export function updateMyTankPosition(
  myTank: TankGroup,
  myTankProps: TankProps | null,
  keyboard: KeyboardInputService,
  deltaTime: number,
) {
  if (!myTankProps) return;

  const input: InputState = {
    w: keyboard.isKeyPressed('KeyW'),
    a: keyboard.isKeyPressed('KeyA'),
    s: keyboard.isKeyPressed('KeyS'),
    d: keyboard.isKeyPressed('KeyD'),
  };

  const currentPosition: TankPosition = {
    position: {
      x: myTank.tankGroup.position.x,
      y: myTank.tankGroup.position.y,
      z: myTank.tankGroup.position.z,
    },
    rotation: myTank.tankGroup.rotation.y,
  };

  const newPosition = applyInput(
    currentPosition,
    input,
    myTankProps.speed,
    myTankProps.rotationSpeed,
    deltaTime,
  );

  myTank.tankGroup.position.x = newPosition.position.x;
  myTank.tankGroup.position.z = newPosition.position.z;
  myTank.tankGroup.rotation.y = newPosition.rotation;
}
