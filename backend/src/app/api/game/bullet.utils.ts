import { BulletVariant } from '../../common/models/bullet.model';

export function findBulletVariant(id: string): BulletVariant | undefined {
  const variants: BulletVariant[] = [getBasicBullet(), getBouncingBullet()];

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

export function getBouncingBullet(): BulletVariant {
  return {
    id: 'bouncingBullet',
    name: 'BouncingBullet',
    speed: 1.3,
    damage: 2.5,
    maxBounceCount: 2,
    scale: { x: 1, y: 1, z: 1 },
    renderScale: { x: 1, y: 1, z: 1 },
  };
}
