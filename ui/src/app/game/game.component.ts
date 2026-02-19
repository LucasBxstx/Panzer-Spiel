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
import { NgOptimizedImage } from '@angular/common';
import { KeyboardInputService } from '../shared/services/keyboard-input.service';
import { GameService } from '../shared/services/game.service';
import { ActivatedRoute } from '@angular/router';
import { Position } from '../shared/models/vector.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { addLight } from './game.utils.ts/add-light';
import { setupCamera } from './game.utils.ts/setup-camera';
import { setupRenderer } from './game.utils.ts/setup-renderer';
import { addGround } from './game.utils.ts/add-ground';
import { createObstacleWithTexture } from './game.utils.ts/add-obstacle';
import { addTank } from './game.utils.ts/add-tank';

@Component({
  selector: 'app-game',
  imports: [NgOptimizedImage],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly keyboard = inject(KeyboardInputService);
  @ViewChild('gameCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private destroyRef = inject(DestroyRef);
  private readonly gameService = inject(GameService);
  private readonly route = inject(ActivatedRoute);
  private readonly showError = signal(false);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  // Panzer-Komponenten
  // private tankGroup!: THREE.Group; // entire tank
  // private tankBody!: THREE.Object3D;
  // private tankTurret!: THREE.Object3D;
  private tanks: {
    tankGroup: THREE.Group;
    tankBody: THREE.Object3D;
    tankTurret: THREE.Object3D;
  }[] = [];

  private animationId?: number;
  private tankSpeed = 0.1;

  private readonly position = signal<Position>({ x: 20, y: 0, z: 20 });

  // Maus-Properties
  private mouse = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private groundPlane!: THREE.Mesh;

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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((gameState) => {
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
      }
    });
  }

  private addTanks(): void {
    const gameState = this.gameService.gameState();

    if (!gameState) {
      return;
    }

    gameState.tanks.forEach((tank) => {
      addTank(this.scene, tank).then((tankObj) => this.tanks.push(tankObj));
    });
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    // this.updateTankPosition();
    // this.updateTurretRotation();
    this.renderer.render(this.scene, this.camera);
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

  // updateTankPosition() {
  //   if (!this.tankGroup) return;
  //
  //   const moveDirection = new THREE.Vector3();
  //   let targetRotation: number | null = null;
  //
  //   // W - Vorwärts
  //   if (this.keyboard.isKeyPressed('KeyW')) {
  //     moveDirection.z -= 1;
  //     if (!this.isRotationNear(this.tankGroup.rotation.y, 0)) {
  //       targetRotation = Math.PI;
  //     }
  //   }
  //
  //   // S - Rückwärts
  //   if (this.keyboard.isKeyPressed('KeyS')) {
  //     moveDirection.z += 1;
  //     if (!this.isRotationNear(this.tankGroup.rotation.y, Math.PI)) {
  //       targetRotation = 0;
  //     }
  //   }
  //
  //   // A - Links
  //   if (this.keyboard.isKeyPressed('KeyA')) {
  //     moveDirection.x -= 1;
  //     if (!this.isRotationNear(this.tankGroup.rotation.y, Math.PI / 2)) {
  //       targetRotation = Math.PI * 1.5;
  //     }
  //   }
  //
  //   // D - Rechts
  //   if (this.keyboard.isKeyPressed('KeyD')) {
  //     moveDirection.x += 1;
  //     if (!this.isRotationNear(this.tankGroup.rotation.y, Math.PI * 1.5)) {
  //       targetRotation = Math.PI / 2;
  //     }
  //   }
  //
  //   // Diagonale Richtungen
  //   if (this.keyboard.isKeyPressed('KeyW') && this.keyboard.isKeyPressed('KeyA')) {
  //     targetRotation = Math.PI * 1.25;
  //   } else if (this.keyboard.isKeyPressed('KeyW') && this.keyboard.isKeyPressed('KeyD')) {
  //     targetRotation = Math.PI * 0.75;
  //   } else if (this.keyboard.isKeyPressed('KeyS') && this.keyboard.isKeyPressed('KeyA')) {
  //     targetRotation = Math.PI * 1.75;
  //   } else if (this.keyboard.isKeyPressed('KeyS') && this.keyboard.isKeyPressed('KeyD')) {
  //     targetRotation = Math.PI * 0.25;
  //   }
  //
  //   // Rotation des GESAMTEN Panzers (tankGroup)
  //   if (targetRotation !== null) {
  //     const rotationSpeed = 0.15;
  //     const diff = this.shortestRotation(this.tankGroup.rotation.y, targetRotation);
  //     this.tankGroup.rotation.y += diff * rotationSpeed;
  //   }
  //
  //   // Bewegung des GESAMTEN Panzers
  //   if (moveDirection.length() > 0) {
  //     moveDirection.normalize();
  //     this.tankGroup.position.x += moveDirection.x * this.tankSpeed;
  //     this.tankGroup.position.z += moveDirection.z * this.tankSpeed;
  //   }
  // }
  //
  // private updateTurretRotation(): void {
  //   if (!this.tankTurret) return;
  //
  //   this.raycaster.setFromCamera(this.mouse, this.camera);
  //
  //   // Weltposition des Turrets
  //   const turretWorldPos = new THREE.Vector3();
  //   this.tankTurret.getWorldPosition(turretWorldPos);
  //
  //   // Plane exakt auf Turret-Höhe
  //   const aimPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -turretWorldPos.y);
  //
  //   const intersectPoint = new THREE.Vector3();
  //   const hit = this.raycaster.ray.intersectPlane(aimPlane, intersectPoint);
  //
  //   // NULL-Check auf den Rückgabewert, nicht auf intersectPoint!
  //   if (!hit) return;
  //
  //   const direction = new THREE.Vector3();
  //   direction.subVectors(intersectPoint, turretWorldPos);
  //   direction.y = 0;
  //
  //   if (direction.lengthSq() < 0.0001) return; // Zu nah, überspringen
  //
  //   const targetRotationWorld = Math.atan2(direction.x, direction.z);
  //
  //   // tankGroup hat initial rotation.y = Math.PI, das muss rein!
  //   const tankWorldRotation = this.tankGroup.rotation.y;
  //   const targetRotationRelative = targetRotationWorld - tankWorldRotation;
  //
  //   const lerpFactor = 0.15;
  //   const diff = this.shortestRotation(this.tankTurret.rotation.y, targetRotationRelative);
  //   this.tankTurret.rotation.y += diff * lerpFactor;
  // }
  //
  // private isRotationNear(current: number, target: number, tolerance: number = 0.2): boolean {
  //   const diff = Math.abs(this.shortestRotation(current, target));
  //   return diff < tolerance;
  // }
  //
  // private shortestRotation(current: number, target: number): number {
  //   let diff = target - current;
  //
  //   while (diff > Math.PI) diff -= Math.PI * 2;
  //   while (diff < -Math.PI) diff += Math.PI * 2;
  //
  //   return diff;
  // }
}
