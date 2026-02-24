import { GameStateResponse, InitialGameStateResponse } from '../../shared/models/game.model';

export function updateGameState(
  oldState: InitialGameStateResponse,
  newState: GameStateResponse,
): InitialGameStateResponse {
  const update: InitialGameStateResponse = {
    ...oldState,
    bullets: newState.bullets,
  };
  const tanks = update.tanks;
  // console.log('new State', newState);
  newState.tanks.forEach((tank) => {
    const oldTankState = tanks.get(tank.id);

    if (oldTankState) {
      oldTankState.position = tank.position;
      oldTankState.rotation = tank.rotation;
      oldTankState.turretRotation = tank.turretRotation;
      oldTankState.idDead = tank.isDead;
      oldTankState.kills = tank.kills;
      oldTankState.seq = tank.seq;
    }
  });
  console.log('complete gamestate', update);
  return update;
}
