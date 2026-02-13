import { Component, inject, input } from '@angular/core';
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

  public readonly navigateTo = input.required<string>();
  public readonly headingLabel = input.required<string>();
  public readonly backLabel = input.required<string>();

  public navigate(): void {
    this.router.navigate([this.navigateTo()]);
  }
}
