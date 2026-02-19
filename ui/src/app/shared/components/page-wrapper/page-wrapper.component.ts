import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-page-wrapper',
  imports: [NgOptimizedImage],
  templateUrl: './page-wrapper.component.html',
  styleUrl: './page-wrapper.component.scss',
})
export class PageWrapperComponent {
  private readonly router = inject(Router);

  public readonly navigateTo = input<string>();
  public readonly headingLabel = input.required<string>();
  public readonly backLabel = input.required<string>();
  public readonly disableLeavePage = input<boolean>(false);
  public readonly leavePage = output<void>();

  public navigate(): void {
    this.leavePage.emit();
    if (this.navigateTo()) {
      this.router.navigate([this.navigateTo()]);
    }
  }
}
