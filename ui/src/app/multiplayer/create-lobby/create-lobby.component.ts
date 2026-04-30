import {
  AfterViewInit,
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
  BotDifficultyOption,
  CreateLobbyRequest,
  GameModeOption,
  MapPreviewResponse,
  TankTypeOption,
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
import { BotDifficulty } from '../../shared/models/bot.model';
import { TankType } from '../../shared/models/tank.model';

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
export class CreateLobbyComponent implements AfterViewInit {
  protected readonly GameMode = GameMode;
  private readonly lobbyService = inject(LobbyService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  public readonly mapPreviewContainer = viewChild<ElementRef>('mapPreviewContainer');

  public isAlreadyCreatingLobby = false;
  public readonly selectedMapId = signal<string>('containerhub');
  public readonly selectedMode = signal<GameMode>(GameMode.OneVsOne);
  public readonly selectedBotDifficulty = signal<BotDifficulty | null>(null);
  public readonly selectedTankType = signal<TankType>(TankType.Panther);

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
    {
      name: 'Team vs Bots',
      value: GameMode.TeamVsBots,
    },
  ]);

  public readonly availableBotsDifficulties = signal<BotDifficultyOption[]>([
    {
      name: 'Easy',
      value: BotDifficulty.EASY,
    },
    {
      name: 'Intermediate',
      value: BotDifficulty.INTERMEDIATE,
    },
    {
      name: 'Advanced',
      value: BotDifficulty.ADVANCED,
    },
    {
      name: 'Hard',
      value: BotDifficulty.HARD,
    },
  ]);

  public readonly availableTankTypes = signal<TankTypeOption[]>([
    {
      name: 'Panther',
      value: TankType.Panther,
    },
    {
      name: 'Razor',
      value: TankType.Razor,
    },
    {
      name: 'Inferno',
      value: TankType.Inferno,
    },
    {
      name: 'Reaper',
      value: TankType.Reaper,
    },
    {
      name: 'Nightshade',
      value: TankType.Nightshade,
    },
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
    numberOfBots: new FormControl<number>(0, {
      validators: [Validators.min(0)],
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

        const { teamSize, numberOfTeams, numberOfBots } = this.formGroup.getRawValue();

        return (
          teamSize > map.maxTeamSize ||
          numberOfTeams > map.maxTeamCount ||
          numberOfBots > map.maxTeamSize
        );
      }),
    ),
    { initialValue: false },
  );

  constructor() {
    effect(() => {
      const selectedMode = this.selectedMode();
      this.formGroup.reset();

      if (selectedMode === GameMode.TeamVsBots) {
        this.formGroup.controls.numberOfBots.setValue(2);
        this.selectedBotDifficulty.set(BotDifficulty.EASY);
      }
    });
  }

  ngAfterViewInit() {
    const el = this.mapPreviewContainer()?.nativeElement;

    el.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      },
      { passive: false },
    );
  }

  public createLobby(): void {
    if (this.formGroup.invalid || this.invalidSettings()) {
      return;
    }

    this.isAlreadyCreatingLobby = true;
    const { numberOfTeams, teamSize, numberOfBots } = this.formGroup.getRawValue();

    let maxPlayersCount;
    if (this.selectedMode() === GameMode.TeamVsBots) {
      maxPlayersCount = teamSize;
    } else {
      maxPlayersCount = numberOfTeams * teamSize;
    }

    const request: CreateLobbyRequest = {
      mapId: this.selectedMapId(),
      gameMode: this.selectedMode(),
      teamSize,
      numberOfTeams,
      numberOfBots,
      maxPlayersCount,
      tankType: this.selectedTankType(),
      botDifficulty: this.selectedBotDifficulty() ?? undefined,
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
