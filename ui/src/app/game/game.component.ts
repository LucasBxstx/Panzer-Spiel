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
  private tank!: THREE.Group;
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

    // Normalisierte Maus-Koordinaten (-1 bis +1)
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffdea6);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    );

    this.camera.position.set(0, 70, 85);
    this.camera.lookAt(0, 0, 0);

    // Renderer mit Tone Mapping
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    // WICHTIG: Tone Mapping für hellere Darstellung
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5; // Helligkeit erhöhen

    // Helleres Licht
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Zusätzliches Gegenlicht (optional)
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-10, 10, -10);
    this.scene.add(backLight);

    // Ground
    this.createDesertGround();

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private loadTankModel(): void {
    const loader = new GLTFLoader();

    loader.load(
      'assets/models/tank-panther.glb',
      (gltf: any) => {
        this.tank = gltf.scene;

        this.tank.scale.set(0.4, 0.4, 0.4);
        this.tank.rotation.set(0, Math.PI, 0);
        this.tank.position.set(this.position().x, 0, this.position().y);

        this.tank.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.scene.add(this.tank);
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

    this.update();
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

    // WICHTIG: Color Space für Diffuse Map setzen!
    sandDiffuse.colorSpace = THREE.SRGBColorSpace;

    // Texturen wiederholen
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

  update() {
    if (!this.tank) return;

    // WASD Bewegung - ABSOLUT (unabhängig von Rotation)
    const moveDirection = new THREE.Vector3();
    let targetRotation: number | null = null;

    // W - Vorwärts (immer in -Z Richtung)
    if (this.keyboard.isKeyPressed('KeyW')) {
      moveDirection.z -= 1;
      targetRotation = Math.PI; // Nach vorne (180°)
    }

    // S - Rückwärts (immer in +Z Richtung)
    if (this.keyboard.isKeyPressed('KeyS')) {
      moveDirection.z += 1;
      targetRotation = 0; // Nach hinten (0°)
    }

    // A - Links (immer in -X Richtung)
    if (this.keyboard.isKeyPressed('KeyA')) {
      moveDirection.x -= 1;
      targetRotation = Math.PI * 1.5; // Nach links (270°)
    }

    // D - Rechts (immer in +X Richtung)
    if (this.keyboard.isKeyPressed('KeyD')) {
      moveDirection.x += 1;
      targetRotation = Math.PI / 2; // Nach rechts (90°)
    }

    // Diagonale Richtungen (wenn zwei Tasten gleichzeitig)
    if (this.keyboard.isKeyPressed('KeyW') && this.keyboard.isKeyPressed('KeyA')) {
      targetRotation = Math.PI * 1.25; // Nach vorne-links (225°)
    } else if (this.keyboard.isKeyPressed('KeyW') && this.keyboard.isKeyPressed('KeyD')) {
      targetRotation = Math.PI * 0.75; // Nach vorne-rechts (135°)
    } else if (this.keyboard.isKeyPressed('KeyS') && this.keyboard.isKeyPressed('KeyA')) {
      targetRotation = Math.PI * 1.75; // Nach hinten-links (315°)
    } else if (this.keyboard.isKeyPressed('KeyS') && this.keyboard.isKeyPressed('KeyD')) {
      targetRotation = Math.PI * 0.25; // Nach hinten-rechts (45°)
    }

    // Panzer sanft zur Zielrotation drehen
    if (targetRotation !== null) {
      const rotationSpeed = 0.15; // Wie schnell der Panzer sich dreht
      const diff = this.shortestRotation(this.tank.rotation.y, targetRotation);
      this.tank.rotation.y += diff * rotationSpeed;
    }

    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      this.tank.position.x += moveDirection.x * this.tankSpeed;
      this.tank.position.z += moveDirection.z * this.tankSpeed;
    }
  }

  private shortestRotation(current: number, target: number): number {
    let diff = target - current;

    // Normalisieren auf -PI bis PI
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    return diff;
  }
}
