import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GameModeComponent } from './game-mode/game-mode.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
    // loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'gamemode',
    component: GameModeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'multiplayer',
    component: MultiplayerComponent,
    canActivate: [AuthGuardService],
  },
];
