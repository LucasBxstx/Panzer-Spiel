import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import nipplejs, { JoystickManager, JoystickOutputData } from 'nipplejs';
import { KeyboardInputService } from '../../services/keyboard-input.service';

@Component({
  selector: 'app-joystick',
  template: `<div #joystickZone class="joystick-zone"></div>`,
  styles: [
    `
      .joystick-zone {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 150px;
        height: 150px;
        z-index: 100;
      }
    `,
  ],
})
export class JoystickComponent implements OnInit, OnDestroy {
  private readonly keyboardService = inject(KeyboardInputService);
  @ViewChild('joystickZone', { static: true }) joystickZone!: ElementRef;

  private manager!: JoystickManager;

  ngOnInit() {
    this.manager = nipplejs.create({
      zone: this.joystickZone.nativeElement,
      mode: 'static',
      position: { left: '75px', top: '75px' },
      color: 'rgba(255,255,255,0.8)',
      size: 120,
    });

    this.manager.on('move', (_, data: JoystickOutputData) => {
      if (!data.vector) return;

      const threshold = 0.3;

      const dirX =
        data.vector.x > threshold ? 'right' : data.vector.x < -threshold ? 'left' : undefined;

      const dirY =
        data.vector.y > threshold ? 'up' : data.vector.y < -threshold ? 'down' : undefined;

      this.keyboardService.setMovement(dirX, dirY);
    });

    this.manager.on('end', () => this.keyboardService.setMovement());
  }

  ngOnDestroy() {
    this.manager?.destroy();
  }
}
