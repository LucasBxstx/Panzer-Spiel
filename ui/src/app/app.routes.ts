import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GameModeComponent } from './game-mode/game-mode.component';
import { AuthGuardService } from './shared/services/auth-guard.service';

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
    // component: RegisterComponent,
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'gamemode',
    component: GameModeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'multiplayer',
    // component: MultiplayerComponent,
    loadComponent: () =>
      import('./multiplayer/multiplayer.component').then((m) => m.MultiplayerComponent),
    canActivate: [AuthGuardService],
  },
  {
    path: 'create-lobby',
    loadComponent: () =>
      import('./multiplayer/create-lobby/create-lobby.component').then(
        (m) => m.CreateLobbyComponent,
      ),
  },
  {
    path: 'lobby/:id',
    loadComponent: () =>
      import('./multiplayer/lobby/lobby.component').then((m) => m.LobbyComponent),
  },
  {
    path: 'game/:id',
    loadComponent: () => import('./game/game.component').then((m) => m.GameComponent),
  },
];
