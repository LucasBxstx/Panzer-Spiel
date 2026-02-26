import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { KeyboardInputService } from '../shared/services/keyboard-input.service';
import { GameService } from '../shared/services/game.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { addLight } from './game.utils.ts/add-light';
import { setupCamera } from './game.utils.ts/setup-camera';
import { setupRenderer } from './game.utils.ts/setup-renderer';
import { createObstacleWithModel, createObstacleWithTexture } from './game.utils.ts/add-obstacle';
import { addTank } from './game.utils.ts/add-tank';
import { InputState, TankGroup, TankPosition } from '../shared/models/tank.model';
import { calculateMyTurretRotation } from './game.utils.ts/calculateMyTurretRotation';
import { catchError, finalize, throwError } from 'rxjs';
import { applyInput } from './game.utils.ts/applyInput';
import { addGround } from './game.utils.ts/add-ground';
import { Vector3D } from '../shared/models/vector.model';
import { BulletObject } from '../shared/models/bullet.model';
import { createBullet } from './game.utils.ts/add-bullet';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { IngameScoreComponent } from './ingame-score/ingame-score.component';
import { ExplosionResponse, ExplosionService } from './game.utils.ts/explosion-service';
import { setupCss2dRenderer } from './game.utils.ts/setup-css-2d-renderer';
import { CSS2DRenderer } from 'three-stdlib';
import { getCliffLandscape } from './game.utils.ts/create-map-helper';

@Component({
  selector: 'app-game',
  imports: [SpinnerComponent, RouterOutlet, IngameScoreComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;
  private destroyRef = inject(DestroyRef);

  private readonly keyboardService = inject(KeyboardInputService);
  public readonly gameService = inject(GameService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly showError = signal(false);
  public readonly showSpinner = signal(true);
  private scene!: THREE.Scene;

  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private clock = new THREE.Clock();
  private labelRenderer!: CSS2DRenderer;
  private explosionService!: ExplosionService;

  private mouse = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();

  private lastTurretSendTime = 0;
  private lastUpdatedTurretRotation = 0;
  private readonly TURRET_SEND_INTERVAL = 50;
  private lastTankSendTime = 0;
  private readonly TANK_SEND_INTERVAL = 50;
  private lastShotTime = 0;
  private SHOOT_SEND_INTERVAL = 500;

  private tanks: TankGroup[] = [];
  private myTank?: TankGroup;
  public bullets: BulletObject[] = [];
  private animationId?: number;
  private localPosition!: TankPosition;
  private pendingBullets = new Set<string>();
  private pendingInputs: {
    seq: number;
    input: InputState;
    deltaTime: number;
  }[] = [];

  public youHaveBeenKilled = signal(false);

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  constructor() {
    effect(() => {
      this.showError.set(!this.gameService.connected());
    });
  }

  ngOnInit(): void {
    this.joinOrRejoinGame();
  }

  private joinOrRejoinGame(): void {
    const gameId = this.route.snapshot.paramMap.get('id');
    if (!gameId) {
      this.showError.set(true);
      setTimeout(() => {
        this.router.navigate(['/multiplayer']);
      }, 2000);
      return;
    }

    this.gameService
      .joinGame(gameId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          this.showError.set(true);
          setTimeout(() => {
            this.router.navigate(['/multiplayer']);
          }, 2000);
          return throwError(() => error);
        }),
        finalize(() => {
          this.showSpinner.set(false);
        }),
      )
      .subscribe(() => {
        this.drawGame();
      });
  }

  private drawGame(): void {
    this.initThreeJS();
    this.buildMap();
    this.addTanks();
    this.animate();
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffdea6);

    this.camera = setupCamera(canvas);
    this.renderer = setupRenderer(canvas);
    this.labelRenderer = setupCss2dRenderer();
    document.body.appendChild(this.labelRenderer.domElement);

    addLight(this.scene);

    this.explosionService = new ExplosionService(this.scene);

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private buildMap() {
    const gameState = this.gameService.gameState();

    if (!gameState) {
      return;
    }

    addGround(this.scene, gameState.map);

    gameState.map.obstacles.forEach((obstacle) => {
      if (obstacle.texture) {
        createObstacleWithTexture(this.scene, obstacle);
      } else if (obstacle.modelUrl) {
        createObstacleWithModel(this.scene, obstacle);
      }
    });

    // build map helper
    // obstacles.push(...getDesertMesaLandscape());
    // obstacles.push(getDesertGround());
    // const walls = getWalls();
    // walls.forEach((w) => createObstacleWithTexture(this.scene, w));
    const cliffs = getCliffLandscape();
    cliffs.forEach((o) => createObstacleWithModel(this.scene, o));
  }

  private addTanks(): void {
    const gameState = this.gameService.gameState();

    if (!gameState) {
      return;
    }

    gameState.tanks.forEach((tank) => {
      addTank(this.scene, tank, false).then((tankObj) => {
        this.tanks.push(tankObj);

        if (tankObj.tankId === gameState.myTankId) {
          this.myTank = tankObj;
          const { x, y, z } = tankObj.tankGroup.position;
          this.lastUpdatedTurretRotation = tankObj.tankTurret.position.y;
          this.localPosition = {
            position: { x, y, z },
            rotation: tankObj.tankGroup.rotation.y,
          };
        }
      });
    });
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    const deltaTime = this.clock.getDelta();

    this.updateMyTankPosition(deltaTime);
    this.updateMyTurretRotation();
    this.updateAllTankPositions();
    this.updateFireBullets();
    this.updateBulletPositions();
    this.explosionService.update();

    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  private updateMyTurretRotation(): void {
    if (!this.myTank) return;

    const rotation = calculateMyTurretRotation(
      this.myTank,
      this.raycaster,
      this.mouse,
      this.camera,
    );

    this.myTank.tankTurret.rotation.y = rotation;

    const worldRotation = rotation + this.myTank.tankBody.rotation.y;

    if (Math.abs(this.lastUpdatedTurretRotation - worldRotation) < 0.001) return;

    const now = Date.now();
    if (now - this.lastTurretSendTime < this.TURRET_SEND_INTERVAL) return;

    this.lastUpdatedTurretRotation = worldRotation;
    this.lastTurretSendTime = now;

    this.gameService.updateTurretRotation({ rotation: worldRotation });
  }

  private updateAllTankPositions(): void {
    const data = this.gameService.gameState();

    if (!data) return;

    this.tanks.forEach((tankGroup) => {
      const newTankState = data.tanks.get(tankGroup.tankId);
      const isMyTank = tankGroup.tankId === this.myTank?.tankId;
      if (!newTankState || newTankState.idDead) {
        const config: ExplosionResponse = {
          id: `explosion-${tankGroup.tankId}`,
          scale: { x: 3, y: 3, z: 3 }, // größer = stärkere Explosion
          position: {
            x: tankGroup.tankGroup.position.x,
            y: tankGroup.tankGroup.position.y,
            z: tankGroup.tankGroup.position.z,
          },
        };
        this.explosionService.createExplosion(config);

        tankGroup.nameLabel.element.style.setProperty('display', 'none');

        this.scene.remove(tankGroup.tankGroup);

        tankGroup.tankGroup.traverse((object: any) => {
          if (object.isMesh) {
            object.geometry?.dispose();

            if (Array.isArray(object.material)) {
              object.material.forEach((mat: any) => this.disposeMaterial(mat));
            } else if (object.material) {
              this.disposeMaterial(object.material);
            }
          }
        });

        if (isMyTank) {
          this.myTank = undefined;
          this.showYouHaveBeenKilled();
        }

        this.tanks = this.tanks.filter((t) => t !== tankGroup);
      } else if (newTankState) {
        tankGroup.tankGroup.position.x = newTankState.position.x;
        tankGroup.tankGroup.position.y = newTankState.position.y;
        tankGroup.tankGroup.position.z = newTankState.position.z;
        tankGroup.tankBody.rotation.y = newTankState.rotation;
        if (!isMyTank)
          tankGroup.tankTurret.rotation.y = newTankState.turretRotation - newTankState.rotation;
      }
    });
  }

  private updateMyTankPosition(deltaTime: number): void {
    const input: InputState = {
      w: this.keyboardService.isKeyPressed('KeyW'),
      a: this.keyboardService.isKeyPressed('KeyA'),
      s: this.keyboardService.isKeyPressed('KeyS'),
      d: this.keyboardService.isKeyPressed('KeyD'),
    };

    const noKeyPressed = !Object.values(input).some((v) => v);
    const myTankProps = this.gameService.myTankProps();
    if (noKeyPressed || !myTankProps) return;

    const now = Date.now();
    if (now - this.lastTankSendTime < this.TANK_SEND_INTERVAL) return;
    this.lastTankSendTime = now;

    const seq = myTankProps.seq;

    this.localPosition = applyInput(
      this.localPosition,
      input,
      myTankProps.speed,
      myTankProps.rotationSpeed,
      deltaTime,
    );

    // If tank movement is too laggy in production, we can assign the new position directly
    // But for now in development, the game is so smooth, that we don't need to do prediction
    // this.myTank.tankGroup.position.x = this.localPosition.position.x;
    // this.myTank.tankGroup.position.z = this.localPosition.position.z;
    // this.myTank.tankGroup.rotation.y = this.localPosition.rotation;

    this.pendingInputs.push({ seq, input, deltaTime });

    this.gameService.updateTankPosition({ seq, input, deltaTime, timestamp: Date.now() });
  }

  private updateFireBullets(): void {
    const isSpacePressed = this.keyboardService.isKeyPressed('Space');

    if (!isSpacePressed || !this.myTank) return;

    const now = Date.now();
    if (now - this.lastShotTime < this.SHOOT_SEND_INTERVAL) return;
    this.lastShotTime = now;

    const position = this.myTank.tankGroup.position;
    const rotation = this.myTank.tankTurret.rotation.y;

    const direction: Vector3D = {
      x: Math.sin(rotation),
      y: 0,
      z: Math.cos(rotation),
    };

    const playerMovement: InputState = {
      w: this.keyboardService.isKeyPressed('KeyW'),
      a: this.keyboardService.isKeyPressed('KeyA'),
      s: this.keyboardService.isKeyPressed('KeyS'),
      d: this.keyboardService.isKeyPressed('KeyD'),
    };

    this.gameService.fireBullet({ position, direction, rotation, playerMovement });
  }

  private updateBulletPositions(): void {
    const bullets = this.gameService.gameState()?.bullets;
    if (!bullets) return;

    this.bullets = this.bullets.filter((b) => {
      const stillExists = bullets.find((bullet) => bullet.id === b.id);

      if (!stillExists) {
        const config: ExplosionResponse = {
          id: `explosion-${b.id}`,
          scale: { x: 1, y: 1, z: 1 }, // größer = stärkere Explosion
          position: {
            x: b.object.position.x,
            y: b.object.position.y,
            z: b.object.position.z,
          },
        };
        this.explosionService.createExplosion(config);

        this.scene.remove(b.object);
        const mesh = b.object as THREE.Mesh;
        mesh.geometry?.dispose();

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            this.disposeMaterial(mat);
          });
        } else {
          this.disposeMaterial(mesh.material);
        }
      }

      return !!stillExists;
    });

    bullets.forEach((bullet) => {
      const existingBullet = this.bullets.find((b) => b.id === bullet.id);
      if (existingBullet) {
        existingBullet.object.position.set(bullet.position.x, bullet.position.y, bullet.position.z);
        existingBullet.object.rotation.y = bullet.rotation;
      } else if (!this.pendingBullets.has(bullet.id)) {
        this.pendingBullets.add(bullet.id);
        const newBullet = createBullet(this.scene, bullet);
        this.pendingBullets.delete(bullet.id);
        this.bullets.push({ id: bullet.id, object: newBullet });
      }
    });
  }

  private disposeMaterial(material: THREE.Material) {
    // Array von möglichen Textur-Properties, die dispose() haben
    const textureProps = [
      'map',
      'alphaMap',
      'aoMap',
      'bumpMap',
      'displacementMap',
      'emissiveMap',
      'envMap',
      'lightMap',
      'metalnessMap',
      'normalMap',
      'roughnessMap',
      'specularMap',
      'gradientMap',
    ];

    textureProps.forEach((prop) => {
      const tex = (material as any)[prop];
      if (tex && typeof tex.dispose === 'function') {
        tex.dispose();
      }
    });

    material.dispose();
  }

  private onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  private showYouHaveBeenKilled(): void {
    this.youHaveBeenKilled.set(true);
    setTimeout(() => {
      this.youHaveBeenKilled.set(false);
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.scene) {
      this.scene.traverse((object: any) => {
        if (object.isCSS2DObject) {
          object.element?.remove();
        }

        if (object.isMesh) {
          object.geometry?.dispose();

          if (Array.isArray(object.material)) {
            object.material.forEach((mat: any) => this.disposeMaterial(mat));
          } else if (object.material) {
            this.disposeMaterial(object.material);
          }
        }
      });
      this.scene.clear();
    }

    if (this.renderer) this.renderer.dispose();

    if (this.labelRenderer) {
      this.labelRenderer.domElement.remove();
    }

    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }
}
