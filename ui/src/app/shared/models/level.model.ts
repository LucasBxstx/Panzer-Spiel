import { TankType } from './tank.model';
import { MapPreviewResponse } from './lobby.model';

export interface LevelPreviewResponse {
  id: number;
  name: string;
  alreadyAchieved: boolean;
  unlocked: boolean;
  previewPictureURL: string;
  enemyTeamTankPreview: EnemyTeamTankPreviewResponse[];
}

export interface LevelResponse extends LevelPreviewResponse {
  selectableTanks: SelectableTankVariantResponse[];
  mapPreview: MapPreviewResponse;
}

export interface EnemyTeamTankPreviewResponse {
  tankType: TankType;
  count: number;
  color: string;
}

export interface SelectableTankVariantResponse {
  id: number;
  name: string;
  tankType: TankType;
  unlocked: boolean;
  previewPictureURL: string;
  speed: number;
  hp: number;
  damage: number;
  bulletSpeed: number;
  bulletBounceCount: number;
  color: string;
}

export interface StartLevelResponse {
  gameId: string;
}

export interface PlayLevelRequest {
  id: number;
  selectedTankType: TankType;
}
