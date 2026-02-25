import { CSS2DRenderer } from 'three-stdlib';

export function setupCss2dRenderer(): CSS2DRenderer {
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0';
  labelRenderer.domElement.style.pointerEvents = 'none';
  return labelRenderer;
}
