import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';

const DRAWING_COLOUR = '#7C86FF';

function chalkTexture() {
  const pixels = new Uint8Array(8 * 128 * 4);
  let seed = 21871;
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 8; x++) {
      seed = (seed * 16807) % 2147483647;
      const index = (y * 8 + x) * 4;
      const edge = Math.min(1, (x + 0.5) / 1.5, (7.5 - x) / 1.5);
      pixels.set([255, 255, 255, Math.round(255 * edge * (0.5 + 0.5 * seed / 2147483647))], index);
    }
  }
  const texture = new THREE.DataTexture(pixels, 8, 128);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.channel = 2;
  texture.needsUpdate = true;
  return texture;
}

function paintedStroke(surface: THREE.Mesh, position: THREE.Vector3, orientation: THREE.Euler, size: THREE.Vector3, texture: THREE.Texture) {
  const geometry = new DecalGeometry(surface, position, orientation, size);
  const positions = geometry.getAttribute('position');
  const normals = geometry.getAttribute('normal');
  const surfaceUv: number[] = [];
  const woodUv: number[] = [];
  const raycaster = new THREE.Raycaster();
  raycaster.far = 0.02;
  geometry.setAttribute('uv2', geometry.getAttribute('uv').clone());

  for (let i = 0; i < positions.count; i++) {
    const point = new THREE.Vector3().fromBufferAttribute(positions, i);
    const normal = new THREE.Vector3().fromBufferAttribute(normals, i).normalize();
    raycaster.set(point.addScaledVector(normal, 0.005), normal.negate());
    const hit = raycaster.intersectObject(surface, false)[0];
    const uv = hit?.uv ?? new THREE.Vector2();
    const uv1 = hit?.uv1 ?? uv;
    surfaceUv.push(uv.x, uv.y);
    woodUv.push(uv1.x, uv1.y);
  }
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(surfaceUv, 2));
  geometry.setAttribute('uv1', new THREE.Float32BufferAttribute(woodUv, 2));

  const material = (surface.material as THREE.MeshStandardMaterial).clone();
  material.color.set(DRAWING_COLOUR);
  material.map = texture;
  material.transparent = true;
  material.depthWrite = false;
  material.polygonOffset = true;
  material.polygonOffsetFactor = -2;
  material.polygonOffsetUnits = -2;
  const stroke = new THREE.Mesh(geometry, material);
  stroke.receiveShadow = true;
  stroke.renderOrder = 2;
  return stroke;
}

function addContactShadow(scene: THREE.Scene, chalk: THREE.Mesh, template: THREE.Mesh, tray: THREE.Mesh) {
  const aoMap = (tray.material as THREE.MeshStandardMaterial).aoMap;
  if (!aoMap) return;

  const chalkPosition = chalk.getWorldPosition(new THREE.Vector3());
  const originalPosition = template.getWorldPosition(new THREE.Vector3());
  const trayBounds = new THREE.Box3().setFromObject(tray);
  const chalkWidth = new THREE.Box3().setFromObject(chalk).getSize(new THREE.Vector3()).x;
  const geometry = new DecalGeometry(tray,
    new THREE.Vector3(chalkPosition.x, trayBounds.max.y, chalkPosition.z),
    new THREE.Euler(-Math.PI / 2, 0, 0),
    new THREE.Vector3(chalkWidth + 0.4, 0.42, 0.03));
  const positions = geometry.getAttribute('position');
  const sourceUv: number[] = [];
  const clearUv: number[] = [];
  const raycaster = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);

  for (let i = 0; i < positions.count; i++) {
    const origin = new THREE.Vector3().fromBufferAttribute(positions, i);
    origin.x += originalPosition.x - chalkPosition.x;
    origin.y = trayBounds.max.y + 1;
    raycaster.set(origin, down);
    const source = raycaster.intersectObject(tray, false)[0]?.uv;
    origin.x -= chalkWidth + 0.4;
    raycaster.set(origin, down);
    const clear = raycaster.intersectObject(tray, false)[0]?.uv;
    if (!source || !clear) {
      geometry.dispose();
      return;
    }
    sourceUv.push(source.x, source.y);
    clearUv.push(clear.x, clear.y);
  }

  geometry.setAttribute('sourceUv', new THREE.Float32BufferAttribute(sourceUv, 2));
  geometry.setAttribute('clearUv', new THREE.Float32BufferAttribute(clearUv, 2));
  const material = new THREE.ShaderMaterial({
    uniforms: { aoMap: { value: aoMap } },
    vertexShader: `
      attribute vec2 sourceUv;
      attribute vec2 clearUv;
      varying vec2 vUv;
      varying vec2 vSourceUv;
      varying vec2 vClearUv;
      void main() {
        vUv = uv;
        vSourceUv = sourceUv;
        vClearUv = clearUv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform sampler2D aoMap;
      varying vec2 vUv;
      varying vec2 vSourceUv;
      varying vec2 vClearUv;
      void main() {
        vec2 edge = min(vUv, 1.0 - vUv);
        float fade = smoothstep(0.0, 0.12, edge.x) * smoothstep(0.0, 0.12, edge.y);
        float clear = max(texture2D(aoMap, vClearUv).r, 0.001);
        float contact = clamp(texture2D(aoMap, vSourceUv).r / clear, 0.0, 1.0);
        gl_FragColor = vec4(0.0, 0.0, 0.0, (1.0 - pow(contact, 1.0 / 2.2)) * fade);
      }`,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
    toneMapped: false,
  });
  const shadow = new THREE.Mesh(geometry, material);
  shadow.name = 'drawingChalkShadow';
  shadow.renderOrder = 3;
  scene.add(shadow);
}

export default function addDrawingNavigation(scene: THREE.Scene) {
  if (scene.getObjectByName('drawingChalk')) return;

  const template = scene.getObjectByName('chalk1') as THREE.Mesh;
  const eraser = scene.getObjectByName('eraser');
  const frame = scene.getObjectByName('borderB') as THREE.Mesh;
  const tray = scene.getObjectByName('tray') as THREE.Mesh;
  if (!template?.isMesh || !template.parent || !eraser || !frame?.isMesh || !tray?.isMesh) return;

  const chalk = template.clone();
  chalk.name = 'drawingChalkVisual';
  const material = (template.material as THREE.MeshStandardMaterial).clone();
  material.color.set(DRAWING_COLOUR);
  chalk.material = material;
  chalk.position.set(eraser.position.x + 1.4, template.position.y, template.position.z);

  const target = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.32, 0.6),
    new THREE.MeshBasicMaterial({ color: DRAWING_COLOUR, transparent: true, opacity: 0, depthWrite: false }),
  );
  target.name = 'drawingChalk';
  target.position.copy(chalk.position);
  template.parent.add(chalk, target);
  scene.updateMatrixWorld(true);
  addContactShadow(scene, chalk, template, tray);

  const chalkPosition = chalk.getWorldPosition(new THREE.Vector3());
  const frameBounds = new THREE.Box3().setFromObject(frame);
  const trayBounds = new THREE.Box3().setFromObject(tray);
  const texture = chalkTexture();
  const frameStroke = paintedStroke(frame,
    new THREE.Vector3(chalkPosition.x, frameBounds.getCenter(new THREE.Vector3()).y, 0),
    new THREE.Euler(),
    new THREE.Vector3(0.02, frameBounds.max.y - frameBounds.min.y + 0.02, 1), texture);
  const trayStroke = paintedStroke(tray,
    new THREE.Vector3(chalkPosition.x, trayBounds.max.y, (frameBounds.min.z + chalkPosition.z) / 2),
    new THREE.Euler(-Math.PI / 2, 0, 0),
    new THREE.Vector3(0.02, chalkPosition.z - frameBounds.min.z, 0.03), texture);
  frameStroke.name = 'drawingChalkFrameStroke';
  trayStroke.name = 'drawingChalkTrayStroke';
  scene.add(frameStroke, trayStroke);
}
