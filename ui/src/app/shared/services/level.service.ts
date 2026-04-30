import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LevelPreviewResponseDto,
  LevelResponseDto,
  PlayLevelDto,
  StartLevelResponseDto,
} from '../models/level.model';

@Injectable({
  providedIn: 'root',
})
export class LevelService {
  private readonly httpClient = inject(HttpClient);

  public getAllLevels(): Observable<LevelPreviewResponseDto[]> {
    return this.httpClient.get<LevelPreviewResponseDto[]>(
      `${environment.apiUrl}/level/level-previews`,
    );
  }

  public getLevel(levelId: number): Observable<LevelResponseDto> {
    return this.httpClient.get<LevelResponseDto>(`${environment.apiUrl}/level/${levelId}`);
  }

  public startLevel(
    levelId: number,
    playLevelDto: PlayLevelDto,
  ): Observable<StartLevelResponseDto> {
    return this.httpClient.post<StartLevelResponseDto>(`${environment.apiUrl}/level/${levelId}`, {
      playLevelDto,
    });
  }
}
