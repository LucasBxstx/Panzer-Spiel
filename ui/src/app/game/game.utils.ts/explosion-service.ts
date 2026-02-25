import * as THREE from 'three';
import { Position, Scale } from '../../shared/models/vector.model';

export interface ExplosionResponse {
  id: string;
  position: Position;
  scale: Scale;
}

interface ExplosionInstance {
  id: string;
  particles: THREE.Points;
  sparks: THREE.Points;
  shockwave: THREE.Mesh;
  fireball: THREE.Mesh;
  startTime: number;
  duration: number;
  velocities: Float32Array;
  sparkVelocities: Float32Array;
}

export class ExplosionService {
  private scene: THREE.Scene;
  private activeExplosions: Map<string, ExplosionInstance> = new Map();
  private clock = new THREE.Clock();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  /**
   * Creates an animated fiery explosion at the given position.
   * Automatically removes itself after 2 seconds.
   */
  createExplosion(config: ExplosionResponse): void {
    const { id, position, scale } = config;
    const pos = new THREE.Vector3(position.x, position.y, position.z);
    const avgScale = (scale.x + scale.y + scale.z) / 3;

    // --- 1. FIRE PARTICLES ---
    const PARTICLE_COUNT = 300;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Start at center with slight random offset
      positions[i * 3] = (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      // Random velocity (mostly upward & outward)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = (0.5 + Math.random() * 2.5) * avgScale;
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.abs(Math.cos(phi)) * speed * 1.5; // Bias upward
      velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

      // Fire gradient: deep red → orange → yellow → white (by particle index)
      const t = i / PARTICLE_COUNT;
      if (t < 0.3) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.1;
        colors[i * 3 + 2] = 0.0; // deep red
      } else if (t < 0.6) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.0; // orange
      } else if (t < 0.85) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0.0; // yellow
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 0.8; // white-hot
      }

      sizes[i] = (0.3 + Math.random() * 0.7) * avgScale * 8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 0.5 * avgScale,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particles.position.copy(pos);

    // --- 2. SPARK PARTICLES (fast, thin, bright) ---
    const SPARK_COUNT = 80;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(SPARK_COUNT * 3);
    const sparkVelocities = new Float32Array(SPARK_COUNT * 3);
    const sparkColors = new Float32Array(SPARK_COUNT * 3);

    for (let i = 0; i < SPARK_COUNT; i++) {
      sparkPos[i * 3] = 0;
      sparkPos[i * 3 + 1] = 0;
      sparkPos[i * 3 + 2] = 0;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = (1 + Math.random() * 4) * avgScale;
      sparkVelocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      sparkVelocities[i * 3 + 1] = (0.5 + Math.random()) * speed;
      sparkVelocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

      sparkColors[i * 3] = 1.0;
      sparkColors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
      sparkColors[i * 3 + 2] = 0.5 + Math.random() * 0.3;
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));

    const sparkMat = new THREE.PointsMaterial({
      size: 0.1 * avgScale,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sparks = new THREE.Points(sparkGeo, sparkMat);
    sparks.position.copy(pos);

    // --- 3. SHOCKWAVE RING ---
    const shockwaveGeo = new THREE.RingGeometry(0.01, 0.3 * avgScale, 32);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(1, 0.6, 0.1),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwave.position.copy(pos);
    shockwave.rotation.x = -Math.PI / 2; // Flat on ground

    // --- 4. FIREBALL CORE (glowing sphere) ---
    const fireballGeo = new THREE.SphereGeometry(0.4 * avgScale, 16, 16);
    const fireballMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(1, 0.5, 0.0),
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const fireball = new THREE.Mesh(fireballGeo, fireballMat);
    fireball.position.copy(pos);

    // Add everything to scene
    this.scene.add(particles);
    this.scene.add(sparks);
    this.scene.add(shockwave);
    this.scene.add(fireball);

    const instance: ExplosionInstance = {
      id,
      particles,
      sparks,
      shockwave,
      fireball,
      startTime: performance.now(),
      duration: 2000, // 2 seconds
      velocities,
      sparkVelocities,
    };

    this.activeExplosions.set(id, instance);

    // Auto-remove after duration
    setTimeout(() => this.removeExplosion(id), instance.duration + 100);
  }

  /**
   * Call this in your animation loop (requestAnimationFrame / ngZone).
   */
  update(): void {
    const now = performance.now();

    this.activeExplosions.forEach((explosion) => {
      const elapsed = (now - explosion.startTime) / 1000; // seconds
      const t = Math.min(elapsed / (explosion.duration / 1000), 1.0); // 0 → 1

      // --- Update fire particles ---
      const firePositions = explosion.particles.geometry.attributes['position']
        .array as Float32Array;
      const PARTICLE_COUNT = firePositions.length / 3;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const vx = explosion.velocities[i * 3];
        const vy = explosion.velocities[i * 3 + 1];
        const vz = explosion.velocities[i * 3 + 2];

        // Position = velocity * time + gravity
        firePositions[i * 3] = vx * elapsed;
        firePositions[i * 3 + 1] = vy * elapsed - 2 * elapsed * elapsed; // gravity
        firePositions[i * 3 + 2] = vz * elapsed;
      }
      explosion.particles.geometry.attributes['position'].needsUpdate = true;

      // Fade out fire particles
      (explosion.particles.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - t * 1.2);
      // Shrink fire particle size over time
      (explosion.particles.material as THREE.PointsMaterial).size *= 0.99;

      // --- Update sparks ---
      const sparkPositions = explosion.sparks.geometry.attributes['position'].array as Float32Array;
      const SPARK_COUNT = sparkPositions.length / 3;

      for (let i = 0; i < SPARK_COUNT; i++) {
        sparkPositions[i * 3] = explosion.sparkVelocities[i * 3] * elapsed;
        sparkPositions[i * 3 + 1] =
          explosion.sparkVelocities[i * 3 + 1] * elapsed - 4 * elapsed * elapsed;
        sparkPositions[i * 3 + 2] = explosion.sparkVelocities[i * 3 + 2] * elapsed;
      }
      explosion.sparks.geometry.attributes['position'].needsUpdate = true;
      (explosion.sparks.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - t * 1.5);

      // --- Shockwave: expand and fade quickly ---
      const shockwaveScale = 1 + t * 8;
      explosion.shockwave.scale.set(shockwaveScale, shockwaveScale, shockwaveScale);
      (explosion.shockwave.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - t * 2);

      // --- Fireball: quick bloom then shrink ---
      const fireballProgress =
        t < 0.15
          ? t / 0.15 // 0→1 bloom phase
          : 1 - (t - 0.15) / 0.85; // 1→0 shrink phase
      const fbScale = fireballProgress * 1.5 + 0.1;
      explosion.fireball.scale.setScalar(Math.max(0, fbScale));
      (explosion.fireball.material as THREE.MeshBasicMaterial).opacity = Math.max(
        0,
        fireballProgress * 0.9,
      );

      // Color shift: orange → red → dark red as it fades
      const r = 1.0;
      const g = Math.max(0, 0.5 - t * 0.5);
      (explosion.fireball.material as THREE.MeshBasicMaterial).color.setRGB(r, g, 0);
    });
  }

  /**
   * Removes explosion from scene and cleans up memory.
   */
  removeExplosion(id: string): void {
    const explosion = this.activeExplosions.get(id);
    if (!explosion) return;

    explosion.particles.geometry.dispose();
    (explosion.particles.material as THREE.Material).dispose();
    this.scene.remove(explosion.particles);

    explosion.sparks.geometry.dispose();
    (explosion.sparks.material as THREE.Material).dispose();
    this.scene.remove(explosion.sparks);

    explosion.shockwave.geometry.dispose();
    (explosion.shockwave.material as THREE.Material).dispose();
    this.scene.remove(explosion.shockwave);

    explosion.fireball.geometry.dispose();
    (explosion.fireball.material as THREE.Material).dispose();
    this.scene.remove(explosion.fireball);

    this.activeExplosions.delete(id);
  }
}
