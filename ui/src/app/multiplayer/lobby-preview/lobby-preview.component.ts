import { Component, input } from '@angular/core';
import { LobbyPreview } from '../../shared/models/lobby-preview.model';

@Component({
  selector: 'app-lobby-preview',
  imports: [],
  templateUrl: './lobby-preview.component.html',
  styleUrl: './lobby-preview.component.scss',
})
export class LobbyPreviewComponent {
  public readonly lobbyPreview = input.required<LobbyPreview>();
}
