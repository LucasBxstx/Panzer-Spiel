import { Component, input } from '@angular/core';
import { MapPreviewResponse } from '../../models/lobby.model';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-map-preview',
  imports: [NgOptimizedImage],
  templateUrl: './map-preview.component.html',
  styleUrl: './map-preview.component.scss',
})
export class MapPreviewComponent {
  public readonly map = input.required<MapPreviewResponse>();
  public readonly isSelected = input<boolean>(false);
}
