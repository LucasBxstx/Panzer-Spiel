import { Component, computed, input, output, signal } from '@angular/core';
import { ChipComponent } from '../chip/chip.component';
import { PropertyDisplayComponent } from '../../../singleplayer/level/property-display/property-display.component';
import { TankIconComponent } from '../tank-icon/tank-icon.component';
import { TankType } from '../../models/tank.model';
import { SelectableTankVariantResponse } from '../../models/level.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tank-selection',
  imports: [ChipComponent, PropertyDisplayComponent, TankIconComponent, NgClass],
  templateUrl: './tank-selection.component.html',
  styleUrl: './tank-selection.component.scss',
})
export class TankSelectionComponent {
  public readonly selectableTanks = input.required<SelectableTankVariantResponse[]>();
  public readonly selectedTankType = signal<TankType>(TankType.Panther);
  public readonly updateSelectedTank = output<TankType>();

  public readonly selectedTank = computed(() =>
    this.selectableTanks().find((t) => t.tankType === this.selectedTankType()),
  );

  public readonly speedDisplay = computed(() =>
    Array.from({ length: 19 }, (_, i) => ({ filled: i < (this.selectedTank()?.speed ?? 0) })),
  );

  public readonly healthDisplay = computed(() =>
    Array.from({ length: 15 }, (_, i) => ({ filled: i < (this.selectedTank()?.hp ?? 0) })),
  );

  public readonly damageDisplay = computed(() =>
    Array.from({ length: 4 }, (_, i) => ({ filled: i < (this.selectedTank()?.damage ?? 0) })),
  );

  public readonly bulletSpeedDisplay = computed(() =>
    Array.from({ length: 20 }, (_, i) => {
      const bulletSpeed = this.selectedTank()?.bulletSpeed;

      return {
        filled: i < (bulletSpeed ? bulletSpeed * 10 : 0),
      };
    }),
  );

  public readonly bulletBounceDisplay = computed(() =>
    Array.from({ length: 3 }, (_, i) => ({
      filled: i < (this.selectedTank()?.bulletBounceCount ?? 0),
    })),
  );

  public selectTank(tankType: TankType): void {
    const tank = this.selectableTanks().find((t) => t.tankType === tankType);

    if (tank && tank.unlocked) {
      this.selectedTankType.set(tankType);
      this.updateSelectedTank.emit(tankType);
    }
  }
}
