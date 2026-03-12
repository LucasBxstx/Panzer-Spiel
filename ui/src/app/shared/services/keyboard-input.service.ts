import { Injectable, signal } from '@angular/core';
import { InputState } from '../models/tank.model';

@Injectable({
  providedIn: 'root',
})
export class KeyboardInputService {
  private keys = new Set<string>();

  public readonly joystickMovement = signal<InputState>({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  public readonly joystickRotation = signal<number>(0);

  constructor() {
    window.addEventListener('keydown', (event) => {
      this.keys.add(event.code);
    });

    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.code);
    });
  }

  isKeyPressed(code: string): boolean {
    return this.keys.has(code);
  }

  setMovement(directionX?: 'left' | 'right', directionY?: 'up' | 'down') {
    this.joystickMovement.update((movement) => {
      movement.d = directionX === 'right';
      movement.a = directionX === 'left';
      movement.w = directionY === 'up';
      movement.s = directionY === 'down';

      return movement;
    });
  }

  setRotation(radian: number) {
    this.joystickRotation.set(radian);
  }
}
