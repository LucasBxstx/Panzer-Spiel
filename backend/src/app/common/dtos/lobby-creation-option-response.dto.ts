import { Expose, Type } from 'class-transformer';
import { SelectableTankVariantResponseDto } from '../../api/level/webservice/dto/level-response.dto';
import { MapPreviewResponseDto } from './map-preview-response.dto';

export class LobbyCreationOptionsResponseDto {
  @Expose()
  @Type(() => MapPreviewResponseDto)
  mapPreviews: MapPreviewResponseDto[];

  @Expose()
  @Type(() => SelectableTankVariantResponseDto)
  selectableTanks: SelectableTankVariantResponseDto[];

  constructor(
    mapPreview: MapPreviewResponseDto[],
    selectableTanks: SelectableTankVariantResponseDto[],
  ) {
    this.mapPreviews = mapPreview;
    this.selectableTanks = selectableTanks;
  }
}
