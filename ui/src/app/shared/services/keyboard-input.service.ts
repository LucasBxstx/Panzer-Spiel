import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class KeyboardInputService {
  private keys = new Set<string>();

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
}
