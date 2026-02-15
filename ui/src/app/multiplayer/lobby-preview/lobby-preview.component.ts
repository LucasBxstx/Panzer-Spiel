import { Component, DestroyRef, inject, input } from '@angular/core';
import { LobbyPreviewResponse } from '../../shared/models/lobby-preview.model';
import { LobbyService } from '../../shared/services/lobby.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby-preview',
  imports: [],
  templateUrl: './lobby-preview.component.html',
  styleUrl: './lobby-preview.component.scss',
})
export class LobbyPreviewComponent {
  private readonly lobbyService = inject(LobbyService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  public readonly lobbyPreview = input.required<LobbyPreviewResponse>();

  public joinLobby(): void {
    this.lobbyService
      .joinLobby(this.lobbyPreview().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lobby) => {
        this.router.navigate([`/lobby/${lobby.id}`]);
      });
  }
}
