import { Component, input } from '@angular/core';
import { LevelPreviewResponse } from '../../shared/models/level.model';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { TankIconComponent } from '../../shared/components/tank-icon/tank-icon.component';

@Component({
  selector: 'app-level-preview',
  imports: [NgOptimizedImage, TankIconComponent, NgClass],
  templateUrl: './level-preview.component.html',
  styleUrl: './level-preview.component.scss',
})
export class LevelPreviewComponent {
  public readonly level = input.required<LevelPreviewResponse>();
}
