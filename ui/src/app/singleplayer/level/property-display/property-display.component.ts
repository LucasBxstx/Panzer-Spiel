import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export interface PropertyBlock {
  filled: boolean;
}

@Component({
  selector: 'app-property-display',
  imports: [NgClass],
  templateUrl: './property-display.component.html',
  styleUrl: './property-display.component.scss',
})
export class PropertyDisplayComponent {
  public readonly propertyName = input.required<string>();
  public readonly propertyBlocks = input.required<PropertyBlock[]>();
}
