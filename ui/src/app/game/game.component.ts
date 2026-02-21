import {
  Component,
  DestroyRef,
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
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;
  private destroyRef = inject(DestroyRef);

  private readonly keyboardService = inject(KeyboardInputService);
  private readonly gameService = inject(GameService);
  private readonly route = inject(ActivatedRoute);
  public readonly showError = signal(false);
  public readonly showSpinner = signal(true);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private clock = new THREE.Clock();

  private mouse = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();

  private lastTurretSendTime = 0;
  private lastUpdatedTurretRotation = 0;
  private readonly TURRET_SEND_INTERVAL = 50;
  private lastTankSendTime = 0;
  private readonly TANK_SEND_INTERVAL = 50;

  private tanks: TankGroup[] = [];
  private myTank?: TankGroup;
  private animationId?: number;
  private localPosition!: TankPosition;
  private pendingInputs: {
    seq: number;
    input: InputState;
    deltaTime: number;
  }[] = [];

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id');
    if (!gameId) {
      this.showError.set(true);
      return;
    }

    this.gameService
      .joinGame(gameId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          this.showError.set(true);
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

    addLight(this.scene);

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
    // const cliffs = getCliffLandscape();
    // cliffs.forEach((o) => createObstacleWithModel(this.scene, o));
  }

  private addTanks(): void {
    const gameState = this.gameService.gameState();

    if (!gameState) {
      return;
    }

    gameState.tanks.forEach((tank) => {
      addTank(this.scene, tank).then((tankObj) => {
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
    this.updateOtherTankPositions();

    this.renderer.render(this.scene, this.camera);
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
    if (Math.abs(this.lastUpdatedTurretRotation - rotation) < 0.001) return;

    const now = Date.now();
    if (now - this.lastTurretSendTime < this.TURRET_SEND_INTERVAL) return;

    this.lastUpdatedTurretRotation = rotation;
    this.lastTurretSendTime = now;

    this.gameService.updateTurretRotation({ rotation });
  }

  private updateOtherTankPositions(): void {
    const data = this.gameService.gameState();

    if (!data) return;

    this.tanks.forEach((tankGroup) => {
      const newTankState = data.tanks.get(tankGroup.tankId);
      const isMyTank = tankGroup.tankId === this.myTank?.tankId;

      if (newTankState) {
        tankGroup.tankGroup.position.x = newTankState.position.x;
        tankGroup.tankGroup.position.y = newTankState.position.y;
        tankGroup.tankGroup.position.z = newTankState.position.z;
        tankGroup.tankBody.rotation.y = newTankState.rotation;
        if (!isMyTank) tankGroup.tankTurret.rotation.y = newTankState.turretRotation;
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

  private onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.renderer.dispose();
    this.scene.clear();

    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }
}
