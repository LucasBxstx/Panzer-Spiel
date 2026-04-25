import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import nipplejs, { JoystickManager, JoystickOutputData } from 'nipplejs';
import { KeyboardInputService } from '../../services/keyboard-input.service';

@Component({
  selector: 'app-joystick',
  template: `<div
    #joystickZone
    [id]="joystickZone"
    class="joystick-zone"
    [class.left]="useCase() === 'movement'"
    [class.right]="useCase() === 'rotation'"
  ></div>`,
  styles: [
    `
      .joystick-zone {
        position: fixed;
        bottom: 5px;

        width: 120px;
        height: 120px;
        z-index: 100;

        &.left {
          left: 5px;
        }

        &.right {
          right: 5px;
        }
      }
    `,
  ],
})
export class JoystickComponent implements AfterViewInit, OnDestroy {
  private readonly keyboardService = inject(KeyboardInputService);
  private manager!: JoystickManager;
  public useCase = input.required<'movement' | 'rotation'>();

  @ViewChild('joystickZone', { static: true }) joystickZone!: ElementRef;

  ngAfterViewInit() {
    this.manager = nipplejs.create({
      zone: this.joystickZone.nativeElement,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'rgba(255,255,255,0.8)',
      size: 100,
    });

    this.manager.on('move', (_, data: JoystickOutputData) => {
      if (this.useCase() === 'movement') {
        if (!data.vector) return;

        const threshold = 0.1;
        const dirX =
          data.vector.x > threshold ? 'right' : data.vector.x < -threshold ? 'left' : undefined;

        const dirY =
          data.vector.y > threshold ? 'up' : data.vector.y < -threshold ? 'down' : undefined;

        this.keyboardService.setMovement(dirX, dirY);
      } else if (this.useCase() === 'rotation') {
        if (!data.angle.radian) return;

        this.keyboardService.setRotation(data.angle.radian);
      }
    });

    this.manager.on('end', () => {
      if (this.useCase() === 'movement') this.keyboardService.setMovement();
    });
  }

  ngOnDestroy() {
    this.manager?.destroy();
  }
}
