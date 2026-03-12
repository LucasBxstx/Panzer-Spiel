import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  readonly isMobile = signal(this.detectMobile());

  private detectMobile(): boolean {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;
    const isMobileAgent = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

    return hasTouch && (isSmallScreen || isMobileAgent);
  }
}
