import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import {
  CreateLobbyRequest,
  GameModeOption,
  MapPreviewResponse,
} from '../../shared/models/lobby.model';
import { MapPreviewComponent } from '../../shared/components/map-preview/map-preview.component';
import { GameMode } from '../../shared/models/lobby-preview.model';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LobbyService } from '../../shared/services/lobby.service';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { map, merge } from 'rxjs';

@Component({
  selector: 'app-create-lobby',
  imports: [
    CardComponent,
    PageWrapperComponent,
    MapPreviewComponent,
    ChipComponent,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
  templateUrl: './create-lobby.component.html',
  styleUrl: './create-lobby.component.scss',
})
export class CreateLobbyComponent {
  protected readonly GameMode = GameMode;
  private readonly lobbyService = inject(LobbyService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  public readonly mapPreviewContainer = viewChild<ElementRef>('mapPreviewContainer');

  public isAlreadyCreatingLobby = false;
  public readonly selectedMapId = signal<string>('containerhub');
  public readonly selectedMode = signal<GameMode>(GameMode.OneVsOne);

  public readonly availableMaps = toSignal<MapPreviewResponse[] | null>(
    this.lobbyService.getAvailableMaps().pipe(takeUntilDestroyed(this.destroyRef)),
    {
      initialValue: null,
    },
  );

  public readonly availableModes = signal<GameModeOption[]>([
    {
      name: '1 vs 1',
      value: GameMode.OneVsOne,
    },
    {
      name: 'Team vs Team',
      value: GameMode.TeamVsTeam,
    },
    // {
    //   name: 'Team vs Bots',
    //   value: GameMode.TeamVsBots,
    // },
  ]);

  public readonly formGroup = new FormGroup({
    numberOfTeams: new FormControl<number>(2, {
      validators: [Validators.min(2)],
      nonNullable: true,
    }),
    teamSize: new FormControl<number>(1, {
      validators: [Validators.min(1)],
      nonNullable: true,
    }),
  });

  public readonly invalidSettings = toSignal(
    merge(
      this.formGroup.valueChanges,
      toObservable(this.selectedMapId),
      toObservable(this.availableMaps),
    ).pipe(
      map(() => {
        const map = this.availableMaps()?.find((m) => m.id === this.selectedMapId());
        if (!map) return true;

        const { teamSize, numberOfTeams } = this.formGroup.getRawValue();

        return teamSize > map.maxTeamSize || numberOfTeams > map.maxTeamCount;
      }),
    ),
    { initialValue: false },
  );

  constructor() {
    effect(() => {
      this.selectedMode();
      this.formGroup.reset();
    });
  }

  public createLobby(): void {
    if (this.formGroup.invalid || this.invalidSettings()) {
      return;
    }

    this.isAlreadyCreatingLobby = true;
    const { numberOfTeams, teamSize } = this.formGroup.getRawValue();

    const request: CreateLobbyRequest = {
      mapId: this.selectedMapId(),
      gameMode: this.selectedMode(),
      teamSize,
      numberOfTeams,
      maxPlayersCount: numberOfTeams * teamSize,
    };

    this.lobbyService
      .createLobby(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lobby) => {
        this.router.navigate([`/lobby/${lobby.id}`]);
      });
  }

  public scrollToRight(): void {
    this.mapPreviewContainer()?.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
