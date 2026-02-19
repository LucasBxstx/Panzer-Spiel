import * as THREE from 'three';
import { TextureResponse } from '../../shared/models/texture.model';

export function loadTexture(texture: TextureResponse): {
  diffuse: THREE.Texture<HTMLImageElement>;
  normal: THREE.Texture<HTMLImageElement>;
  roughness: THREE.Texture<HTMLImageElement>;
} {
  const textureLoader = new THREE.TextureLoader();

  const diffuse = textureLoader.load(texture.diffuseImageUrl);
  const normal = textureLoader.load(texture.normalImageUrl);
  const roughness = textureLoader.load(texture.roughnessImageUrl);
  diffuse.colorSpace = THREE.SRGBColorSpace;

  [diffuse, normal, roughness].forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(texture.repeat.x, texture.repeat.y);
  });

  return {
    diffuse,
    normal,
    roughness,
  };
}
