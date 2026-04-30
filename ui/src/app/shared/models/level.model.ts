import { TankType } from './tank.model';

export interface LevelPreviewResponseDto {
  id: number;
  name: string;
  alreadyAchieved: boolean;
  unlocked: boolean;
  previewPictureURL: string;
  enemyTeamTankPreview: EnemyTeamTankPreviewResponseDto[];
}

export interface LevelResponseDto extends LevelPreviewResponseDto {
  selectableTanks: SelectableTankVariantResponseDto[];
}

export interface EnemyTeamTankPreviewResponseDto {
  tankType: TankType;
  count: number;
}

export interface SelectableTankVariantResponseDto {
  id: number;
  name: string;
  tankType: TankType;
}

export interface StartLevelResponseDto {
  gameId: string;
}

export interface PlayLevelDto {
  id: number;
  selectedTankType: TankType;
}
