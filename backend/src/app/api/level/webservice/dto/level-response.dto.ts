import { Expose, plainToInstance, Type } from 'class-transformer';
import { TankType, TankVariant } from '../../../../common/models/tank.model';
import { Level } from '../../../../common/models/level.model';
import { findMap } from '../../../game/maps/map.utils';
import {
  getAllTankVariants,
  getTankTypeBgColor,
} from '../../../game/tank.utils';
import { MapPreviewResponseDto } from '../../../../common/dtos/map-preview-response.dto';

export class LevelPreviewResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  alreadyAchieved: boolean;

  @Expose()
  unlocked: boolean;

  @Expose()
  previewPictureURL: string;

  @Expose()
  @Type(() => EnemyTeamTankPreviewResponseDto)
  enemyTeamTankPreview: EnemyTeamTankPreviewResponseDto[];

  public static mapFromEntity(level: Level): LevelPreviewResponseDto {
    const map = findMap(level.mapId);
    const previewPictureURL = map
      ? map.pictureUrl
      : 'assets/pictures/map-container-hub.png';

    const tankTypeWithCount = new Map<TankType, number>();

    level.botSettings.forEach((entry) => {
      const currentCount = tankTypeWithCount.get(entry.tankType) ?? 0;
      tankTypeWithCount.set(entry.tankType, currentCount + 1);
    });

    const enemyTeamTankPreview = Array.from(tankTypeWithCount.entries())
      .map(([tankType, count]) =>
        EnemyTeamTankPreviewResponseDto.mapToDto(tankType, count),
      )
      .filter((entry) => entry.count !== 0);
    return plainToInstance(
      LevelPreviewResponseDto,
      {
        id: level.id,
        name: level.name,
        previewPictureURL,
        alreadyAchieved: false,
        unlocked: true,
        enemyTeamTankPreview,
      },
      { excludeExtraneousValues: true },
    );
  }
}

export class LevelResponseDto extends LevelPreviewResponseDto {
  @Expose()
  @Type(() => SelectableTankVariantResponseDto)
  selectableTanks: SelectableTankVariantResponseDto[];

  @Expose()
  @Type(() => MapPreviewResponseDto)
  mapPreview: MapPreviewResponseDto;

  public static mapFromEntity(level: Level): LevelResponseDto {
    const selectableTanks = getAllTankVariants().map((v) =>
      SelectableTankVariantResponseDto.mapToDto(v),
    );

    return plainToInstance(
      LevelResponseDto,
      {
        ...LevelPreviewResponseDto.mapFromEntity(level),
        selectableTanks,
        mapPreview: MapPreviewResponseDto.mapFromEntity(findMap(level.mapId)!),
      },
      { excludeExtraneousValues: true },
    );
  }
}

export class EnemyTeamTankPreviewResponseDto {
  @Expose()
  tankType: TankType;

  @Expose()
  count: number;

  @Expose()
  color: string;

  public static mapToDto(
    tankType: TankType,
    count: number,
  ): EnemyTeamTankPreviewResponseDto {
    return plainToInstance(
      EnemyTeamTankPreviewResponseDto,
      {
        tankType: tankType,
        count: count,
        color: getTankTypeBgColor(tankType),
      },
      { excludeExtraneousValues: true },
    );
  }
}

export class SelectableTankVariantResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  tankType: TankType;

  // @Expose()
  // unlocked: boolean;
  //
  // @Expose()
  // previewPictureURL: string;

  public static mapToDto(
    tankVariant: TankVariant,
  ): SelectableTankVariantResponseDto {
    return plainToInstance(
      SelectableTankVariantResponseDto,
      {
        id: tankVariant.id,
        name: tankVariant.name,
        tankType: tankVariant.tankType,
      },
      { excludeExtraneousValues: true },
    );
  }
}

export class StartLevelResponseDto {
  @Expose()
  gameId: string;

  public static mapToDto(gameId: string): StartLevelResponseDto {
    return plainToInstance(
      StartLevelResponseDto,
      { gameId },
      { excludeExtraneousValues: true },
    );
  }
}
