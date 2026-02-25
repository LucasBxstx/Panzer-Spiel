import * as THREE from 'three';
import { Scene } from 'three';
import { BulletResponse } from '../../shared/models/bullet.model';

export function createBullet(
  scene: Scene,
  bullet: BulletResponse,
  showHitbox: boolean = false,
): THREE.Object3D {
  // kein Promise mehr nötig!
  const s = bullet.scale;
  const p = bullet.position;

  // --- Hitbox (unsichtbar, für Kollision) ---
  const hitboxGeo = new THREE.BoxGeometry(s.x, s.y, s.z);
  const hitboxMat = new THREE.MeshStandardMaterial({ visible: false });
  const bulletBody = new THREE.Mesh(hitboxGeo, hitboxMat);
  bulletBody.position.set(p.x, p.y, p.z);
  bulletBody.rotation.set(0, bullet.rotation, 0);

  // --- Projektil-Körper (länglicher Zylinder) ---
  const length = Math.max(s.x, s.z) * 1.2;
  const radius = Math.min(s.x, s.z) * 0.18;

  const shellGeo = new THREE.CylinderGeometry(radius * 0.7, radius, length, 8);
  const shellMat = new THREE.MeshStandardMaterial({
    color: 0xc8a040, // Messing-Farbe
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x221100,
  });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  // Zylinder standardmäßig Y-Achse → entlang Flugrichtung (Z) drehen
  shell.rotation.x = Math.PI / 2;
  shell.castShadow = true;
  bulletBody.add(shell);

  // --- Spitze (Konus) ---
  const tipGeo = new THREE.ConeGeometry(radius * 0.7, length * 0.4, 8);
  const tipMat = new THREE.MeshStandardMaterial({
    color: 0x888888, // Stahl
    metalness: 1.0,
    roughness: 0.15,
  });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.rotation.x = Math.PI / 2;
  tip.position.z = length * 0.7; // vorne
  bulletBody.add(tip);

  // --- Leuchtspur (Glow-Trail) ---
  const trailGeo = new THREE.CylinderGeometry(radius * 0.3, radius * 0.8, length * 1.5, 6);
  const trailMat = new THREE.MeshBasicMaterial({
    color: 0xff6600,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const trail = new THREE.Mesh(trailGeo, trailMat);
  trail.rotation.x = Math.PI / 2;
  trail.position.z = -length * 0.8; // hinter der Kugel
  bulletBody.add(trail);

  // --- Optionaler Hitbox-Wireframe ---
  if (showHitbox) {
    const edges = new THREE.EdgesGeometry(hitboxGeo);
    const hitboxLines = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xff0000, depthTest: true }),
    );
    bulletBody.add(hitboxLines);
  }

  scene.add(bulletBody);
  return bulletBody; // synchron!
}
