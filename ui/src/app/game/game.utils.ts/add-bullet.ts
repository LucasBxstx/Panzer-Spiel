import * as THREE from 'three';
import { Scene } from 'three';
import { BulletResponse } from '../../shared/models/bullet.model';

export function createDefaultBullet(
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

export function createBouncingBullet(
  scene: Scene,
  bullet: BulletResponse,
  showHitbox: boolean = false,
): THREE.Object3D {
  const s = bullet.scale;
  const p = bullet.position;

  // --- Hitbox ---
  const hitboxGeo = new THREE.BoxGeometry(s.x, s.y, s.z);
  const hitboxMat = new THREE.MeshStandardMaterial({ visible: false });
  const bulletBody = new THREE.Mesh(hitboxGeo, hitboxMat);
  bulletBody.position.set(p.x, p.y, p.z);
  bulletBody.rotation.set(0, bullet.rotation, 0);

  const length = Math.max(s.x, s.z) * 1.2;
  const radius = Math.min(s.x, s.z) * 0.18;

  // --- Raketenkörper ---
  const bodyGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.8, length, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.8,
    roughness: 0.3,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.rotation.x = Math.PI / 2;
  body.castShadow = true;
  bulletBody.add(body);

  // --- Spitze ---
  const tipGeo = new THREE.ConeGeometry(radius * 0.6, length * 0.5, 8);
  const tipMat = new THREE.MeshStandardMaterial({
    color: 0xcc2200,
    metalness: 0.5,
    roughness: 0.4,
  });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.rotation.x = Math.PI / 2;
  tip.position.z = length * 0.75;
  bulletBody.add(tip);

  // --- Fins ---
  const finGeo = new THREE.BoxGeometry(radius * 0.15, radius * 1.2, radius * 0.8);
  const finMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.7,
    roughness: 0.4,
  });
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeo, finMat);
    fin.rotation.z = (i * Math.PI) / 2;
    fin.position.z = -length * 0.4;
    bulletBody.add(fin);
  }

  // --- Düse ---
  const nozzleGeo = new THREE.CylinderGeometry(radius * 0.4, radius * 0.5, radius * 0.3, 8);
  const nozzleMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 1.0,
    roughness: 0.1,
  });
  const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
  nozzle.rotation.x = Math.PI / 2;
  nozzle.position.z = -length * 0.55;
  bulletBody.add(nozzle);

  // --- Feuerschweif ---
  const particleCount = 40;
  const posArr = new Float32Array(particleCount * 3);
  const colArr = new Float32Array(particleCount * 3);
  const szArr = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    posArr[i * 3] = 0;
    posArr[i * 3 + 1] = 0;
    posArr[i * 3 + 2] = -length * 0.55;
    szArr[i] = 0;
  }

  const particleGeo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(posArr, 3);
  const colAttr = new THREE.BufferAttribute(colArr, 3);
  const szAttr = new THREE.BufferAttribute(szArr, 1);

  particleGeo.setAttribute('position', posAttr);
  particleGeo.setAttribute('color', colAttr);
  particleGeo.setAttribute('size', szAttr);

  const particleMat = new THREE.PointsMaterial({
    size: radius * 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  bulletBody.add(particles);

  const particleData: { z: number; life: number; spread: number }[] = [];
  for (let i = 0; i < particleCount; i++) {
    particleData.push({
      z: -length * 0.55 - Math.random() * length * 2,
      life: Math.random(),
      spread: (Math.random() - 0.5) * radius * 0.8,
    });
  }

  (bulletBody as any).updateTrail = () => {
    for (let i = 0; i < particleCount; i++) {
      particleData[i].life -= 0.04;
      particleData[i].z -= 0.012;

      if (particleData[i].life <= 0) {
        particleData[i].life = 0.8 + Math.random() * 0.4;
        particleData[i].z = -length * 0.55;
        particleData[i].spread = (Math.random() - 0.5) * radius * 0.8;
      }

      const t = 1 - particleData[i].life;
      const spread = particleData[i].spread * t;

      posAttr.setXYZ(i, spread, spread, particleData[i].z);

      if (t < 0.3) {
        colAttr.setXYZ(i, 1.0, 0.9 - t, 0.4 - t);
      } else if (t < 0.6) {
        colAttr.setXYZ(i, 1.0, 0.4 - t * 0.3, 0.0);
      } else {
        colAttr.setXYZ(i, 1.0 - (t - 0.6) * 1.5, 0.0, 0.0);
      }

      szAttr.setX(i, (1 - t) * radius * 2.5);
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    szAttr.needsUpdate = true;
  };

  // --- Optionaler Hitbox-Wireframe ---
  if (showHitbox) {
    const edges = new THREE.EdgesGeometry(hitboxGeo);
    const hitboxLines = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xff0000 }),
    );
    bulletBody.add(hitboxLines);
  }

  scene.add(bulletBody);
  return bulletBody;
}
