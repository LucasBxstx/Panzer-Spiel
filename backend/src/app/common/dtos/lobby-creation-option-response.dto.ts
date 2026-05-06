import { Expose, Type } from 'class-transformer';
import {
  LevelPreviewResponseDto,
  SelectableTankVariantResponseDto,
} from '../../api/level/webservice/dto/level-response.dto';
import { MapPreviewResponseDto } from './map-preview-response.dto';

export class LobbyCreationOptionsResponseDto {
  @Expose()
  @Type(() => MapPreviewResponseDto)
  mapPreviews: MapPreviewResponseDto[];

  @Expose()
  @Type(() => SelectableTankVariantResponseDto)
  selectableTanks: SelectableTankVariantResponseDto[];

  @Expose()
  @Type(() => LevelPreviewResponseDto)
  levelPreviews: LevelPreviewResponseDto[];

  constructor(
    mapPreview: MapPreviewResponseDto[],
    selectableTanks: SelectableTankVariantResponseDto[],
    levelPreviews: LevelPreviewResponseDto[],
  ) {
    this.mapPreviews = mapPreview;
    this.selectableTanks = selectableTanks;
    this.levelPreviews = levelPreviews;
  }
}
