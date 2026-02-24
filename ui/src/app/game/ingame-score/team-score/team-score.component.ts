import { Component, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TeamStats } from '../../../shared/models/team.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-team-score',
  imports: [NgOptimizedImage],
  templateUrl: './team-score.component.html',
  styleUrl: './team-score.component.scss',
})
export class TeamScoreComponent {
  public readonly authService = inject(AuthService);
  public readonly teamData = input.required<TeamStats>();
}
