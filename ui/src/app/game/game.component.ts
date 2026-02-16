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
import { GLTFLoader } from 'three-stdlib';
import { NgOptimizedImage } from '@angular/common';
import { KeyboardInputService } from '../shared/services/keyboard-input.service';

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

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  // Panzer-Komponenten
  private tankGroup!: THREE.Group; // entire tank
  private tankBody!: THREE.Object3D;
  private tankTurret!: THREE.Object3D;

  private animationId?: number;
  private tankSpeed = 0.1;

  private readonly position = signal<{ x: number; y: number }>({ x: 20, y: 20 });

  // Maus-Properties
  private mouse = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private groundPlane!: THREE.Mesh;

  ngOnInit(): void {
    this.initThreeJS();
    this.loadTankModel();
    this.animate();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffdea6);

    this.camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    );

    this.camera.position.set(0, 70, 85);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-10, 10, -10);
    this.scene.add(backLight);

    this.createDesertGround();

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private loadTankModel(): void {
    const loader = new GLTFLoader();

    loader.load(
      'assets/models/tank-panther-split.glb',
      (gltf: any) => {
        this.tankGroup = gltf.scene;

        this.tankGroup.scale.set(0.4, 0.4, 0.4);
        this.tankGroup.rotation.set(0, Math.PI, 0);
        this.tankGroup.position.set(this.position().x, 0, this.position().y);

        // Schatten für alle Meshes
        this.tankGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.tankBody = this.tankGroup.getObjectByName('tank')!;
        this.tankTurret = this.tankGroup.getObjectByName('turret')!;

        this.scene.add(this.tankGroup);
        console.log('Tank model loaded successfully');
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('Error loading tank model:', error);
      },
    );
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    this.updateTankPosition();
    this.updateTurretRotation();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  private createDesertGround(): void {
    const textureLoader = new THREE.TextureLoader();

    const sandDiffuse = textureLoader.load('assets/textures/sandstone_cracks_diff_1k.jpg');
    const sandNormal = textureLoader.load('assets/textures/sandstone_cracks_nor_gl_1k.png');
    const sandRoughness = textureLoader.load('assets/textures/sandstone_cracks_rough_1k.jpg');

    sandDiffuse.colorSpace = THREE.SRGBColorSpace;

    [sandDiffuse, sandNormal, sandRoughness].forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
    });

    const groundGeometry = new THREE.PlaneGeometry(100, 100, 64, 64);

    const groundMaterial = new THREE.MeshStandardMaterial({
      map: sandDiffuse,
      normalMap: sandNormal,
      roughnessMap: sandRoughness,
      roughness: 3.0,
      metalness: 0.2,
    });

    this.groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
    this.groundPlane.rotation.x = -Math.PI / 2;
    this.groundPlane.receiveShadow = true;
    this.scene.add(this.groundPlane);
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.renderer.dispose();
    this.scene.clear();

    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  updateTankPosition() {
    if (!this.tankGroup) return;

    const moveDirection = new THREE.Vector3();
    let targetRotation: number | null = null;

    // W - Vorwärts
    if (this.keyboard.isKeyPressed('KeyW')) {
      moveDirection.z -= 1;
      if (!this.isRotationNear(this.tankGroup.rotation.y, 0)) {
        targetRotation = Math.PI;
      }
    }

    // S - Rückwärts
    if (this.keyboard.isKeyPressed('KeyS')) {
      moveDirection.z += 1;
      if (!this.isRotationNear(this.tankGroup.rotation.y, Math.PI)) {
        targetRotation = 0;
      }
    }

    // A - Links
    if (this.keyboard.isKeyPressed('KeyA')) {
      moveDirection.x -= 1;
      if (!this.isRotationNear(this.tankGroup.rotation.y, Math.PI / 2)) {
        targetRotation = Math.PI * 1.5;
      }
    }

    // D - Rechts
    if (this.keyboard.isKeyPressed('KeyD')) {
      moveDirection.x += 1;
      if (!this.isRotationNear(this.tankGroup.rotation.y, Math.PI * 1.5)) {
        targetRotation = Math.PI / 2;
      }
    }

    // Diagonale Richtungen
    if (this.keyboard.isKeyPressed('KeyW') && this.keyboard.isKeyPressed('KeyA')) {
      targetRotation = Math.PI * 1.25;
    } else if (this.keyboard.isKeyPressed('KeyW') && this.keyboard.isKeyPressed('KeyD')) {
      targetRotation = Math.PI * 0.75;
    } else if (this.keyboard.isKeyPressed('KeyS') && this.keyboard.isKeyPressed('KeyA')) {
      targetRotation = Math.PI * 1.75;
    } else if (this.keyboard.isKeyPressed('KeyS') && this.keyboard.isKeyPressed('KeyD')) {
      targetRotation = Math.PI * 0.25;
    }

    // Rotation des GESAMTEN Panzers (tankGroup)
    if (targetRotation !== null) {
      const rotationSpeed = 0.15;
      const diff = this.shortestRotation(this.tankGroup.rotation.y, targetRotation);
      this.tankGroup.rotation.y += diff * rotationSpeed;
    }

    // Bewegung des GESAMTEN Panzers
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      this.tankGroup.position.x += moveDirection.x * this.tankSpeed;
      this.tankGroup.position.z += moveDirection.z * this.tankSpeed;
    }
  }

  // Turret rotiert zur Maus (unabhängig vom Tank-Körper)
  private updateTurretRotation(): void {
    if (!this.tankTurret || !this.groundPlane) return;

    // Raycaster zur Mausposition
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.groundPlane);

    if (intersects.length > 0) {
      const intersectPoint = intersects[0].point;

      // Weltposition des Turrets
      const turretWorldPos = new THREE.Vector3();
      this.tankTurret.getWorldPosition(turretWorldPos);

      // Richtung vom Turret zur Maus
      const direction = new THREE.Vector3();
      direction.subVectors(intersectPoint, turretWorldPos);
      direction.y = 0; // Nur horizontale Rotation

      // Zielrotation in Weltkoordinaten
      const targetRotationWorld = Math.atan2(direction.x, direction.z);

      // Relative Rotation zum Panzer-Körper berechnen
      // Der Turret ist ein Child vom tankGroup, also müssen wir die Rotation des Parents berücksichtigen
      const targetRotationRelative = targetRotationWorld - this.tankGroup.rotation.y;

      // Sanfte Rotation
      const lerpFactor = 0.15;
      const diff = this.shortestRotation(this.tankTurret.rotation.y, targetRotationRelative);
      this.tankTurret.rotation.y += diff * lerpFactor;
    }
  }

  private isRotationNear(current: number, target: number, tolerance: number = 0.2): boolean {
    const diff = Math.abs(this.shortestRotation(current, target));
    return diff < tolerance;
  }

  private shortestRotation(current: number, target: number): number {
    let diff = target - current;

    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    return diff;
  }
}
