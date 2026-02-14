import { Component, signal } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import { MapPreviewResponse } from '../../shared/models/lobby.model';
import { MapPreviewComponent } from '../../shared/components/map-preview/map-preview.component';

@Component({
  selector: 'app-create-lobby',
  imports: [CardComponent, PageWrapperComponent, MapPreviewComponent],
  templateUrl: './create-lobby.component.html',
  styleUrl: './create-lobby.component.scss',
})
export class CreateLobbyComponent {
  public readonly selectedMapId = signal<string | null>(null);
  public readonly availableMaps = signal<MapPreviewResponse[]>([
    {
      id: '1',
      name: 'Desert',
      pictureUrl: 'assets/pictures/map-desert.png',
    },
    {
      id: '2',
      name: 'Jungle',
      pictureUrl: 'assets/pictures/map-jungle.png',
    },
  ]);
}
