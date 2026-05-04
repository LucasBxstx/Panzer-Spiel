import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LevelPreviewResponse,
  LevelResponse,
  PlayLevelRequest,
  StartLevelResponse,
} from '../models/level.model';

@Injectable({
  providedIn: 'root',
})
export class LevelService {
  private readonly httpClient = inject(HttpClient);

  public getAllLevels(): Observable<LevelPreviewResponse[]> {
    return this.httpClient.get<LevelPreviewResponse[]>(
      `${environment.apiUrl}/level/level-previews`,
    );
  }

  public getLevel(levelId: number): Observable<LevelResponse> {
    return this.httpClient.get<LevelResponse>(`${environment.apiUrl}/level/${levelId}`);
  }

  public startLevel(
    levelId: number,
    playLevelDto: PlayLevelRequest,
  ): Observable<StartLevelResponse> {
    return this.httpClient.post<StartLevelResponse>(
      `${environment.apiUrl}/level/${levelId}`,
      playLevelDto,
    );
  }
}
