import { Component, computed, input } from '@angular/core';
import { LevelPreviewResponseDto } from '../../shared/models/level.model';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { TankType } from '../../shared/models/tank.model';
import { TankIconComponent } from '../../shared/components/tank-icon/tank-icon.component';

@Component({
  selector: 'app-level-preview',
  imports: [NgOptimizedImage, TankIconComponent, NgClass],
  templateUrl: './level-preview.component.html',
  styleUrl: './level-preview.component.scss',
})
export class LevelPreviewComponent {
  public readonly level = input.required<LevelPreviewResponseDto>();
  protected readonly TankType = TankType;

  public tankTypeData = computed(() => {
    const tankData = this.level().enemyTeamTankPreview;

    return tankData.map((tank) => ({
      type: tank.tankType,
      color: this.getTankTypeBgColor(tank.tankType),
      count: tank.count,
    }));
  });

  public getTankTypeBgColor(tankType: TankType): string {
    switch (tankType) {
      case TankType.Panther:
        return '#0f530f';
      case TankType.Razor:
        return '#8b7d7d';
      case TankType.Inferno:
        return '#700b0b';
      case TankType.Reaper:
        return '#1b0c82';
      case TankType.Nightshade:
        return '#040404';
    }
  }
}
