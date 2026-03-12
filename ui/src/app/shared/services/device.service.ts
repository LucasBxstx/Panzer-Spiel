import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  readonly isMobile = signal(this.detectMobile());

  private detectMobile(): boolean {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const isMobileAgent = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

    // iPadOS 13+ tarnt sich als macOS, aber hat Touch
    const isIPad = /Macintosh/i.test(navigator.userAgent) && hasTouch;

    return true || (hasTouch && (isMobileAgent || isIPad));
  }
}
