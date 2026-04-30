import { BulletVariant } from '../../common/models/bullet.model';

export function findBulletVariant(id: string): BulletVariant | undefined {
  const variants: BulletVariant[] = [
    getBasicBullet(),
    getDamagingBullet(),
    getBouncingBullet(),
    getRocketBullet(),
  ];

  return variants.find((v) => v.id === id);
}

export function getBasicBullet(): BulletVariant {
  return {
    id: 'basicBullet',
    name: 'BasicBullet',
    speed: 1.2,
    damage: 2,
    maxBounceCount: 0,
    scale: { x: 1, y: 1, z: 1 },
    renderScale: { x: 1, y: 1, z: 1 },
  };
}

export function getDamagingBullet(): BulletVariant {
  return {
    id: 'damagingBullet',
    name: 'damagingBullet',
    speed: 1.2,
    damage: 4,
    maxBounceCount: 0,
    scale: { x: 1, y: 1, z: 1 },
    renderScale: { x: 1, y: 1, z: 1 },
  };
}

export function getBouncingBullet(): BulletVariant {
  return {
    id: 'bouncingBullet',
    name: 'BouncingBullet',
    speed: 1.5,
    damage: 2,
    maxBounceCount: 2,
    scale: { x: 1, y: 1, z: 1 },
    renderScale: { x: 1, y: 1, z: 1 },
  };
}

export function getRocketBullet(): BulletVariant {
  return {
    id: 'rocketBullet',
    name: 'rocketBullet',
    speed: 2,
    damage: 3,
    maxBounceCount: 3,
    scale: { x: 1, y: 1, z: 1 },
    renderScale: { x: 1, y: 1, z: 1 },
  };
}
