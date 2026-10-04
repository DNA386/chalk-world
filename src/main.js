import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './style.css';

import loadAssets from './components/loader'
import Environment from './components/environment'

import { addLights } from "./components/lights.ts";

import {
  BOARD,
  SECTION_TEXTURE_WIDTH,
  BODY_MARGIN_RATIO,
  PAPER_TITLE_SIZE,
  PAPER_AUTHOR_SIZE,
  PAPER_ENTRY_GAP,
  CHALK_FONT_STACK,
  PAPERS,
  SECTIONS,
} from './components/consts.js'


// const BOARD = {
//   width: 14.8,
//   height: 8.9,
//   frame: 0.42,
//   depth: 0.1
// };
//
// const SECTION_TEXTURE_WIDTH = 1320;
// const BODY_MARGIN_RATIO = 0.22;
// const PAPER_TITLE_SIZE = 25;
// const PAPER_AUTHOR_SIZE = 20;
// const PAPER_ENTRY_GAP = 68;
// const CHALK_FONT_STACK = '"Caveat", "Bradley Hand", "Noteworthy", "Chalkboard SE", cursive';
//
// const PAPERS = [
//   {
//     title: 'Categorifications of Cluster Varieties',
//     authors: 'C. Krawchuk',
//     url: 'https://doi.org/10.17863/CAM.112695',
//   },
//   {
//     title: 'A gluing operation for dimer quivers',
//     authors: 'K. Baur, C. Krawchuk',
//     url: 'https://arxiv.org/abs/2402.02784',
//   },
//   {
//     title: 'Techniques for Constructing Cluster Structures on Varieties',
//     authors: 'C. Krawchuk',
//     url: 'https://ems.press/journals/owr/articles/14298002',
//   },
//   {
//     title: 'Cyclic Complexity of Some Infinite Words and Generalizations',
//     authors: 'C. Krawchuk, N. Rampersad',
//     url: 'https://doi.org/10.5281/zenodo.10581434',
//   },
//   {
//     title: 'Bounds on Decorated Sweep Covers in Tree Posets',
//     authors: 'B. A. Wilson, C. Krawchuk',
//     url: 'https://arxiv.org/abs/2604.03165',
//   },
// ];
//
// const SECTIONS = {
//   debug:  {
//     label: 'Debug',
//     x: 0,
//     y: 0,
//     w: 7.15,
//     h: 2.55,
//     center: true,
//     title: '',
//     lines: [''],
//     lineLinks: [],
//     camera: {
//       position: [-20.0, 0, 10],
//       target: [0.0, 0, 5.0],
//       fov: 40,
//     },
//   },
//   debug2:  {
//     label: 'Debug2',
//     x: 0,
//     y: 0,
//     w: 7.15,
//     h: 2.55,
//     center: true,
//     title: '',
//     lines: [''],
//     lineLinks: [],
//     camera: {
//       position: [10.0, 0, 20],
//       target: [0.0, 0, 5.0],
//       fov: 40,
//     },
//   },
//   far:  {
//     label: 'far',
//     x: 0,
//     y: 0,
//     w: 7.15,
//     h: 2.55,
//     center: true,
//     title: '',
//     lines: [''],
//     lineLinks: [],
//     camera: {
//       position: [10, 5, 30],
//       target: [0.0, 0, 5.0],
//       fov: 20,
//     },
//   },
//
//   overview: {
//     label: 'Board',
//     x: 0,
//     y: 0,
//     w: 7.15,
//     h: 2.55,
//     center: true,
//     title: 'Colin Krawchuk',
//     lines: ['', 'github.com/cgkrawchuk'],
//     lineLinks: [
//       {
//         lineIndex: 1,
//         url: 'https://github.com/cgkrawchuk',
//         title: 'GitHub profile',
//       },
//     ],
//     camera: {
//       position: [0.0, -0.18, 13.9],
//       target: [0.0, -0.08, 0.0],
//       fov: 40,
//     },
//   },
//
//   mathResearch: {
//     label: 'Math Research',
//     x: -4.95,
//     y: 2.35,
//     w: 4.6,
//     h: 2.45,
//     title: 'Math Research',
//     lines: [
//       'I use representation theory to study combinatorial',
//       'and geometric structures, including cluster algebras',
//       'and symmetric groups.',
//       '',
//       'Topics: categorifications, cluster structures',
//       'on algebraic varieties, and modular',
//       'representation theory of symmetric groups.',
//       '',
//       'other: Convolution weights on 2-spaces',
//       'combinatorics on words',
//       'algorithms and complexity'],
//     camera: {
//       position: [-5.1, 2.42, 5.45],
//       target: [-4.95, 2.35, 0.0],
//       fov: 36,
//     },
//   },
//
//   quantum: {
//     label: 'Quantum',
//     x: 4.05,
//     y: 2.15,
//     w: 4.85,
//     h: 2.65,
//     title: 'Quantum',
//     lines: [
//       'Interested in quantum algorithms where symmetry',
//       'and geometry are not just tools, but the point.',
//       '',
//       'This includes optimisation (VQAs, DQI), variational',
//       'trainability (barren plateaus, DLA expressivity),',
//       'and QML generalisation via symmetry.',
//       '',
//       'Projects: Decoded Quantum Interferometry (DQI),',
//       'Quantum Topological Data Analysis (QTDA),',
//       'Quantum Geometric Deep Learning (QGDL)',
//       'talks?',
//     ],
//     camera: {
//       position: [4.82, 2.2, 5.3],
//       target: [4.65, 2.15, 0.0],
//       fov: 35,
//     },
//   },
//
//   papers: {
//     label: 'Papers',
//     x: -4.55,
//     y: -2.2,
//     w: 4.9,
//     h: 2.5,
//     title: 'Papers',
//     lines: [],
//     papers: PAPERS,
//     camera: {
//       position: [-4.6, -2.2, 5.45],
//       target: [-4.55, -2.2, 0.0],
//       fov: 36,
//     },
//   },
//
//   about: {
//     label: 'About',
//     x: 5.25,
//     y: -2.75,
//     w: 4.7,
//     h: 2.35,
//     title: 'About',
//     lines: [
//       'PhD: Categorifications of Cluster Varieties',
//       'University of Cambridge','','Sr. research scientist: Quantinuum'
//
//     ],
//     camera: {
//       position: [5.75, -2.75, 5.0],
//       target: [5.75, -2.75, 0.0],
//       fov: 35,
//     },
//   },
// };
//


// const canvas = document.querySelector('#scene');
// const statusText = document.querySelector('#statusText');
// const navControls = [...document.querySelectorAll('[data-section]')];
// const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//
// const scene = new THREE.Scene();
// scene.background = new THREE.Color("#050706");
// scene.fog = new THREE.FogExp2("#070a08", 0.026);
//
// const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 80);
//
// const renderer = new THREE.WebGLRenderer({
//   canvas,
//   antialias: true,
//   powerPreference: 'high-performance',
// });
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.outputColorSpace = THREE.SRGBColorSpace;
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1.03;
//
//
// const raycaster = new THREE.Raycaster();
// const pointer = new THREE.Vector2(0, 0);
// const parallax = new THREE.Vector2(0, 0);
// const clock = new THREE.Clock();
//
// const activeCameraBase = {
//   position: new THREE.Vector3(),
//   target: new THREE.Vector3(),
//   fov: 40,
// };
// const finalCameraPosition = new THREE.Vector3();
// const finalCameraTarget = new THREE.Vector3();
//
// const interactiveMeshes = [];
// // const sectionHighlights = new Map();
// const sectionHighlights = new Map();
// let activeSection = 'overview';
// let hoveredSection = null;
// let hoveredPaperUrl = null;
// let hoveredPaperTitle = null;
// let transition = null;
// let dustField = null;




async function loadFontsThenStart() {
  const environment = new Environment();
  await loadAssets(environment.scene);
  environment.init();
  environment.animate();
}


loadFontsThenStart();


//
// async function init() {
//   addLights(scene);
//
//   // Importing these from blender
//   // addRoomBackdrop();
//   // addFrameAndProps();
//
//   addBoard();
//
//   // exportBlender();
//
//   addSections();
//   addOverviewEmailImage();
//   dustField = createDustField();
//
//   const initialSection = validSectionFromHash() ?? 'overview';
//   setCameraBase(getCameraState(initialSection));
//   goToSection(initialSection, { immediate: true, updateHash: false });
//
//   window.addEventListener('resize', onResize);
//   canvas.addEventListener('pointermove', onPointerMove);
//   canvas.addEventListener('pointerleave', () => {
//     hoveredPaperUrl = null;
//     hoveredPaperTitle = null;
//     setHoveredSection(null);
//   });
//   canvas.addEventListener('click', onCanvasClick);
//   document.addEventListener('keydown', onKeyDown);
//
//   navControls.forEach((control) => {
//     control.addEventListener('click', (event) => {
//       event.preventDefault();
//       const sectionName = control.dataset.section;
//       goToSection(sectionName);
//     });
//   });
// }
//
// function exportBlender(){
//
//   const exporter = new GLTFExporter();
//
//   exporter.parse(
//       scene,
//       function (gltf) {
//         // Create a blob and trigger a download
//         const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.style.display = 'none';
//         link.href = url;
//         link.download = 'scene.gltf';
//         document.body.appendChild(link);
//         link.click();
//       },
//       function (error) {
//         console.error(error);
//       },
//       { binary: false } // Set to true to export as a .glb binary file instead
//   );
// }
//
// async function importGLTF() {
//   const loader = new GLTFLoader();
//   const gltf = await loader.loadAsync( 'src/blender_scene.gltf' );
//
//   gltf.scene.children.forEach(child => {
//       if (child.name !== "wall") {
//         child.castShadow = true;
//       }
//       child.receiveShadow = true;
//
//       // if (child.name == "chalk3") {
//       //   child.visible = false
//       // }
//   })
//
//   scene.add( gltf.scene );
//
//   console.log("loaded scene", gltf.scene);
// }
//
// function addLineLinkHitboxes(key, section, hitMaterial) {
//   if (!Array.isArray(section.lineLinks) || section.lineLinks.length === 0) return;
//
//   const textureWidth = SECTION_TEXTURE_WIDTH;
//   const textureHeight = Math.round(textureWidth * (section.h / section.w));
//   const padding = Math.max(52, Math.round(textureWidth * 0.055));
//
//   const center = Boolean(section.center);
//   const titleY = center ? textureHeight * 0.39 : padding + 76;
//   const bodyStartY = titleY + (center ? 74 : 78);
//
//   const lineSize = center ? 44 : 42;
//   const lineGap = lineSize * 1.28;
//
//   const bodyX = center ? textureWidth / 2 : textureWidth * BODY_MARGIN_RATIO;
//   const bodyAlign = center ? 'center' : 'left';
//
//   const measureCanvas = document.createElement('canvas');
//   const measureCtx = measureCanvas.getContext('2d');
//   measureCtx.font = `400 ${lineSize}px ${CHALK_FONT_STACK}`;
//
//   section.lineLinks.forEach((link) => {
//     const lineIndex = link.lineIndex;
//     const text = section.lines?.[lineIndex] ?? link.title ?? link.url;
//     const measuredWidth = measureCtx.measureText(text).width;
//     const clickablePaddingX = 34;
//
//     const xLeft = bodyAlign === 'center'
//         ? bodyX - measuredWidth / 2 - clickablePaddingX
//         : bodyX - clickablePaddingX;
//
//     const xRight = bodyAlign === 'center'
//         ? bodyX + measuredWidth / 2 + clickablePaddingX
//         : bodyX + measuredWidth + clickablePaddingX;
//
//     const baselineY = bodyStartY + lineIndex * lineGap;
//     const yTop = baselineY - lineSize - 12;
//     const yBottom = baselineY + 20;
//
//     const centerXInTexture = (xLeft + xRight) / 2;
//     const centerYInTexture = (yTop + yBottom) / 2;
//
//     const rectWidthInTexture = xRight - xLeft;
//     const rectHeightInTexture = yBottom - yTop;
//
//     const centerXWorld =
//         section.x - section.w / 2 +
//         (centerXInTexture / textureWidth) * section.w;
//
//     const centerYWorld =
//         section.y + section.h / 2 -
//         (centerYInTexture / textureHeight) * section.h;
//
//     const rectWidthWorld = (rectWidthInTexture / textureWidth) * section.w;
//     const rectHeightWorld = (rectHeightInTexture / textureHeight) * section.h;
//
//     const linkHitbox = new THREE.Mesh(
//         new THREE.PlaneGeometry(rectWidthWorld, rectHeightWorld),
//         hitMaterial.clone(),
//     );
//
//     linkHitbox.position.set(centerXWorld, centerYWorld, 0.14);
//     linkHitbox.userData.section = key;
//     linkHitbox.userData.paperUrl = link.url;
//     linkHitbox.userData.paperTitle = link.title ?? text;
//     linkHitbox.renderOrder = 8;
//
//     interactiveMeshes.push(linkHitbox);
//     scene.add(linkHitbox);
//   });
// }
//
// function addPaperHitboxes(key, section, hitMaterial) {
//   if (!Array.isArray(section.papers) || section.papers.length === 0) return;
//
//   const textureWidth = SECTION_TEXTURE_WIDTH;
//   const textureHeight = Math.round(textureWidth * (section.h / section.w));
//   const padding = Math.max(52, Math.round(textureWidth * 0.055));
//
//   const titleY = padding + 76;
//   const paperStartY = titleY + 78 - 4;
//   const bodyX = textureWidth * BODY_MARGIN_RATIO;
//
//   section.papers.forEach((paper, index) => {
//     const titleBaselineY = paperStartY + index * PAPER_ENTRY_GAP;
//
//     const xLeft = bodyX - 14;
//     const xRight = textureWidth - padding * 0.7;
//
//     const yTop = titleBaselineY - PAPER_TITLE_SIZE - 7;
//     const yBottom = titleBaselineY + PAPER_AUTHOR_SIZE + 35;
//
//     const centerXInTexture = (xLeft + xRight) / 2;
//     const centerYInTexture = (yTop + yBottom) / 2;
//
//     const rectWidthInTexture = xRight - xLeft;
//     const rectHeightInTexture = yBottom - yTop;
//
//     const centerXWorld =
//         section.x - section.w / 2 +
//         (centerXInTexture / textureWidth) * section.w;
//
//     const centerYWorld =
//         section.y + section.h / 2 -
//         (centerYInTexture / textureHeight) * section.h;
//
//     const rectWidthWorld =
//         (rectWidthInTexture / textureWidth) * section.w;
//
//     const rectHeightWorld =
//         (rectHeightInTexture / textureHeight) * section.h;
//
//     const paperHitbox = new THREE.Mesh(
//         new THREE.PlaneGeometry(rectWidthWorld, rectHeightWorld),
//         hitMaterial.clone(),
//     );
//
//     paperHitbox.position.set(centerXWorld, centerYWorld, 0.135);
//     paperHitbox.userData.section = key;
//     paperHitbox.userData.paperUrl = paper.url;
//     paperHitbox.userData.paperTitle = paper.title;
//     paperHitbox.renderOrder = 7;
//
//     interactiveMeshes.push(paperHitbox);
//     scene.add(paperHitbox);
//   });
// }
//
// function addOverviewEmailImage() {
//   const loader = new THREE.TextureLoader();
//
//   loader.load(
//       `${import.meta.env.BASE_URL}images/contact-email.png`,
//       (texture) => {
//         texture.colorSpace = THREE.SRGBColorSpace;
//         texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
//         texture.minFilter = THREE.LinearFilter;
//         texture.magFilter = THREE.LinearFilter;
//         texture.generateMipmaps = false;
//         texture.needsUpdate = true;
//
//         const material = new THREE.MeshBasicMaterial({
//           map: texture,
//           transparent: true,
//           depthWrite: false,
//         });
//
//         const section = SECTIONS.overview;
//         const sectionTextureWidth = SECTION_TEXTURE_WIDTH;
//         const sectionTextureHeight = Math.round(sectionTextureWidth * (section.h / section.w));
//
//         const titleY = sectionTextureHeight * 0.39;
//         const bodyStartY = titleY + 74;
//         const bodyLineSize = 44;
//         const bodyLineGap = bodyLineSize * 1.28;
//         const bodyLineIndex = 0;
//
//         const emailBaselineY = 62;
//
//         const manualScale = 1.3;
//         const manualOffsetX = 0.0;
//         const manualOffsetY = -0.05;
//
//         const pixelsPerWorldUnit = sectionTextureWidth / section.w;
//         const imageWidth = (texture.image.width / pixelsPerWorldUnit) * manualScale;
//         const imageHeight = (texture.image.height / pixelsPerWorldUnit) * manualScale;
//
//         const bodyBaselineYInTexture = bodyStartY + bodyLineIndex * bodyLineGap;
//         const bodyBaselineWorldY =
//             section.y + section.h / 2 -
//             (bodyBaselineYInTexture / sectionTextureHeight) * section.h;
//
//         const imageLocalBaselineY =
//             imageHeight / 2 -
//             (emailBaselineY / texture.image.height) * imageHeight;
//
//         const mesh = new THREE.Mesh(
//             new THREE.PlaneGeometry(imageWidth, imageHeight),
//             material,
//         );
//
//         mesh.position.set(
//             section.x + manualOffsetX,
//             bodyBaselineWorldY - imageLocalBaselineY + manualOffsetY,
//             0.088,
//         );
//
//         mesh.renderOrder = 8;
//         scene.add(mesh);
//       },
//       undefined,
//       (error) => {
//         console.warn('Could not load overview email image. The rest of the site will still run.', error);
//       },
//   );
// }
//
// function addRoomBackdrop() {
//   const wallTexture = createRoomTexture();
//   wallTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
//
//   const wallMaterial = new THREE.MeshStandardMaterial({
//     map: wallTexture,
//     roughness: 0.95,
//     metalness: 0,
//   });
//
//   const wall = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), wallMaterial);
//   wall.position.set(0, 0, -BOARD.depth);
//   wall.receiveShadow = true;
//   scene.add(wall);
//
//   const vignette = new THREE.Mesh(
//     new THREE.PlaneGeometry(30, 30),
//     new THREE.MeshBasicMaterial({
//       map: createVignetteTexture(0.1, 0.5),
//       transparent: true,
//       depthWrite: false,
//     }),
//   );
//   vignette.position.set(0, 0,  -BOARD.depth + 0.02);
//   vignette.renderOrder = 100;
//   vignette.frustumCulled = false;
//   scene.add(vignette);
// }
//
// function addBoard() {
//   const boardTexture = createBoardTexture();
//   const bumpTexture = createBoardBumpTexture();
//   boardTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
//   bumpTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
//
//   const boardGeometry = createSubtleWarpedPlane(BOARD.width, BOARD.height, 120, 72, 0.011);
//   const boardMaterial = new THREE.MeshStandardMaterial({
//     map: boardTexture,
//     bumpMap: bumpTexture,
//     bumpScale: 0.042,
//     roughness: 0.98,
//     metalness: 0,
//   });
//
//   const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
//   boardMesh.position.z = 0;
//   boardMesh.receiveShadow = true;
//   scene.add(boardMesh);
// }
//
// function addSections() {
//   const hitMaterial = new THREE.MeshBasicMaterial({
//     transparent: true,
//     opacity: 0,
//     depthWrite: false,
//     colorWrite: false,
//     side: THREE.DoubleSide,
//   });
//
//   sectionHighlights.selected = new THREE.PointLight('#bfffb1', 10, 5);
//   sectionHighlights.selected.position.set(0, 0, 5);
//   sectionHighlights.hovered = new THREE.PointLight('#d3ffb9', 10, 3);
//   sectionHighlights.hovered.position.set(0, 0, 2);
//   scene.add(sectionHighlights.selected);
//   scene.add(sectionHighlights.hovered);
//
//   Object.entries(SECTIONS).forEach(([key, section]) => {
//     const labelTexture = createSectionTexture(key, section);
//     labelTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
//
//     const labelMaterial = new THREE.MeshBasicMaterial({
//       map: labelTexture,
//       transparent: true,
//       depthWrite: false,
//     });
//
//     const label = new THREE.Mesh(new THREE.PlaneGeometry(section.w, section.h), labelMaterial);
//     label.position.set(section.x, section.y, 0.1);
//     label.renderOrder = 4;
//     label.userData.section = key;
//     scene.add(label);
//
//     const hitbox = new THREE.Mesh(
//       new THREE.PlaneGeometry(section.w * 1.08, section.h * 1.12),
//       hitMaterial.clone(),
//     );
//     hitbox.position.set(section.x, section.y, 0.11);
//     hitbox.userData.section = key;
//     hitbox.renderOrder = 6;
//     interactiveMeshes.push(hitbox);
//     scene.add(hitbox);
//
//     addPaperHitboxes(key, section, hitMaterial);
//     addLineLinkHitboxes(key, section, hitMaterial);
//   });
// }
//
// function addFrameAndProps() {
//   const woodMaterialH = new THREE.MeshStandardMaterial({
//     map: createWoodTexture(3),
//     roughness: 0.82,
//     metalness: 0.02,
//   });
//   const woodMaterialV = new THREE.MeshStandardMaterial({
//     map: createWoodTexture(2),
//     roughness: 0.82,
//     metalness: 0.02,
//   });
//
//   const frameDepth = 0.48;
//   const frameZ = frameDepth / 2 - BOARD.depth;
//   const horizontalGeometry = new THREE.BoxGeometry(BOARD.width + BOARD.frame * 2, BOARD.frame, frameDepth);
//   const verticalGeometry = new THREE.BoxGeometry(BOARD.height, BOARD.frame, frameDepth);
//
//   const top = new THREE.Mesh(horizontalGeometry, woodMaterialH);
//   top.position.set(0, BOARD.height / 2 + BOARD.frame / 2, frameZ);
//   top.castShadow = true;
//   top.receiveShadow = true;
//   scene.add(top);
//
//   const bottom = new THREE.Mesh(horizontalGeometry, woodMaterialH);
//   bottom.position.set(0, -BOARD.height / 2 - BOARD.frame / 2, frameZ);
//   bottom.castShadow = true;
//   bottom.receiveShadow = true;
//   scene.add(bottom);
//
//   const left = new THREE.Mesh(verticalGeometry, woodMaterialV);
//   left.rotation.z = Math.PI / 2
//   left.position.set(-BOARD.width / 2 - BOARD.frame / 2, 0, frameZ);
//   left.castShadow = true;
//   left.receiveShadow = true;
//   scene.add(left);
//
//   const right = new THREE.Mesh(verticalGeometry, woodMaterialV);
//   right.position.set(BOARD.width / 2 + BOARD.frame / 2, 0, frameZ);
//   right.rotation.z = Math.PI / 2
//   right.castShadow = true;
//   right.receiveShadow = true;
//   scene.add(right);
//
//   const trayMaterial = new THREE.MeshStandardMaterial({
//     // color: '#91a892',
//     map: createWoodTexture(2, 1024,256, '#704d40', '#835e4e'),
//     roughness: 0.78,
//     metalness: 0.02,
//   });
//   const trayHeight = 0.18
//   const tray = new THREE.Mesh(new THREE.BoxGeometry(BOARD.width + 0.2, trayHeight, 1), trayMaterial);
//   tray.position.set(0, -BOARD.height / 2 - BOARD.frame - trayHeight / 2, 0.34);
//   tray.castShadow = true;
//   tray.receiveShadow = true;
//   scene.add(tray);
//
//   const traySurfaceY = -BOARD.height / 2 - BOARD.frame
//
//   addChalkStick(-5.45, traySurfaceY, 0.72, '#a1cf81', -0.18);
//   addChalkStick(-3.55, traySurfaceY, 0.64, '#9478c6', 0.3);
//   addChalkStick(-3.05, traySurfaceY + 0.09, 0.72, '#c8c4b1', -0.3, -0.18);
//   addEraser(4.2, -BOARD.height / 2 - 0.44, 0.72);
// }
//
// function addChalkStick(x, y, z, color, rotationY, rotationZ=0) {
//   const material = new THREE.MeshStandardMaterial({
//     color,
//     roughness: 1,
//     metalness: 0,
//   });
//   const chalkR = 0.055
//   const chalk = new THREE.Mesh(new THREE.CylinderGeometry(chalkR, chalkR, 0.82, 18), material);
//   chalk.position.set(x, y + chalkR, z);
//   chalk.rotation.z = Math.PI / 2 + rotationZ;
//   chalk.rotation.y = rotationY;
//   chalk.castShadow = true;
//   chalk.receiveShadow = true;
//   scene.add(chalk);
// }
//
// function addEraser(x, y, z) {
//   const width = 1.08
//   const height = 0.26
//   const depth = 0.46
//   const body = new THREE.Mesh(
//     new THREE.BoxGeometry(width, height, depth),
//     new THREE.MeshStandardMaterial({
//       color: '#7354a1',
//       roughness: 0.76,
//     }),
//   );
//   body.position.set(x, y + height / 2, z);
//   body.rotation.z = -0.05;
//   body.castShadow = true;
//   body.receiveShadow = true;
//   scene.add(body);
//
//   const felt = new THREE.Mesh(
//     new THREE.BoxGeometry(1.0, 0.17, 0.4),
//     new THREE.MeshStandardMaterial({ color: '#20211f', roughness: 0.98 }),
//   );
//   felt.position.set(x, y + height, z);
//   felt.rotation.z = body.rotation.z;
//   felt.castShadow = true;
//   felt.receiveShadow = true;
//   scene.add(felt);
// }
//
// function createDustField() {
//   const count = 560;
//   const positions = new Float32Array(count * 3);
//   const speeds = new Float32Array(count);
//   const phases = new Float32Array(count);
//   const rnd = makeRandom(9403);
//
//   for (let i = 0; i < count; i += 1) {
//     const j = i * 3;
//     positions[j] = (rnd() - 0.5) * 20.5;
//     positions[j + 1] = (rnd() - 0.5) * 15.8;
//     positions[j + 2] = 0.35 + rnd() * 7.5;
//     speeds[i] = 0.035 + rnd() * 0.08;
//     phases[i] = rnd() * Math.PI * 2;
//   }
//
//   const geometry = new THREE.BufferGeometry();
//   geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//
//   const material = new THREE.PointsMaterial({
//     color: '#e9ffd0',
//     size: 0.02,
//     transparent: true,
//     opacity: 0.3,
//     depthWrite: false,
//     sizeAttenuation: true,
//   });
//
//   const points = new THREE.Points(geometry, material);
//   points.renderOrder = 20;
//   scene.add(points);
//
//   return { points, speeds, phases };
// }
//
// function updateDust(delta, elapsed) {
//   if (!dustField) return;
//
//   const positions = dustField.points.geometry.attributes.position.array;
//   for (let i = 0; i < dustField.speeds.length; i += 1) {
//     const j = i * 3;
//     positions[j + 1] += dustField.speeds[i] * delta;
//     positions[j] += Math.sin(elapsed * 0.55 + dustField.phases[i]) * 0.006 * delta;
//
//     if (positions[j + 1] > BOARD.height / 2 + 1.1) {
//       positions[j + 1] = -BOARD.height / 2 - 1.25;
//     }
//   }
//
//   dustField.points.geometry.attributes.position.needsUpdate = true;
// }
//
// function onPointerMove(event) {
//   const rect = canvas.getBoundingClientRect();
//   pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//   pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
//
//   parallax.x = THREE.MathUtils.clamp(pointer.x, -1, 1);
//   parallax.y = THREE.MathUtils.clamp(pointer.y, -1, 1);
//
//   raycaster.setFromCamera(pointer, camera);
//   const hit = raycaster.intersectObjects(interactiveMeshes, false)[0];
//
//   hoveredPaperUrl = hit?.object?.userData?.paperUrl ?? null;
//   hoveredPaperTitle = hit?.object?.userData?.paperTitle ?? null;
//
//   setHoveredSection(hit?.object?.userData?.section ?? null);
//
//   if (hoveredPaperTitle && statusText) {
//     statusText.textContent = `Open link: ${hoveredPaperTitle}`;
//   }
// }
//
// function onCanvasClick() {
//   if (hoveredPaperUrl) {
//     window.open(hoveredPaperUrl, '_blank', 'noopener,noreferrer');
//     return;
//   }
//
//   if (hoveredSection) {
//     goToSection(hoveredSection);
//   }
// }
//
// function onKeyDown(event) {
//   if (event.altKey || event.ctrlKey || event.metaKey) return;
//
//   const map = {
//     '1': 'overview',
//     '2': 'mathResearch',
//     '3': 'quantum',
//     '4': 'papers',
//     '5': 'about',
//     b: 'overview',
//     m: 'mathResearch',
//     q: 'quantum',
//     p: 'papers',
//     a: 'about',
//     d: 'debug',
//     e: 'debug2',
//     f: 'far',
//   };
//
//   const sectionName = map[event.key.toLowerCase()];
//   if (sectionName) {
//     event.preventDefault();
//     goToSection(sectionName);
//   }
// }
//
// function setHoveredSection(sectionName) {
//   if (hoveredSection === sectionName) return;
//   hoveredSection = sectionName;
//   canvas.style.cursor = sectionName ? 'pointer' : 'default';
//   updateHighlights();
// }
//
// function goToSection(sectionName, options = {}) {
//   if (!SECTIONS[sectionName]) return;
//
//   const { immediate = false, updateHash = true } = options;
//   const targetState = getCameraState(sectionName);
//   const duration = prefersReducedMotion || immediate ? 0 : 1320;
//
//   activeSection = sectionName;
//   updateNavigation();
//   updateHighlights();
//
//   if (statusText) {
//     const section = SECTIONS[sectionName];
//     statusText.textContent = sectionName === 'overview'
//       ? 'Full-board view. Click a chalk section to zoom in.'
//       : `Viewing ${section.label}. Click another chalk section or use the buttons to pan across the board.`;
//   }
//
//   if (updateHash) {
//     window.history.replaceState(null, '', `#${sectionName}`);
//   }
//
//   if (duration === 0) {
//     setCameraBase(targetState);
//     transition = null;
//     return;
//   }
//
//   transition = {
//     start: performance.now(),
//     duration,
//     from: cloneCameraBase(activeCameraBase),
//     to: targetState,
//   };
// }
//
// function updateNavigation() {
//   navControls.forEach((control) => {
//     const isCurrent = control.dataset.section === activeSection;
//     control.setAttribute('aria-current', isCurrent ? 'true' : 'false');
//   });
// }
//
// // function updateHighlights() {
// //   sectionHighlights.forEach((mesh, key) => {
// //     const isActive = key === activeSection;
// //     const isHovered = key === hoveredSection;
// //     mesh.material.opacity = isActive ? 0.58 : isHovered ? 0.43 : 0;
// //     mesh.material.needsUpdate = true;
// //   });
// // }
// function updateHighlights() {
//   if (!!activeSection) {
//     sectionHighlights.selected.position.set(SECTIONS[activeSection].x ?? 0, SECTIONS[activeSection].y ?? 0, sectionHighlights.selected.position.z)
//     sectionHighlights.selected.needsUpdate = true;
//   }
//   if (!!hoveredSection) {
//     sectionHighlights.hovered.position.set(SECTIONS[hoveredSection].x ?? 0, SECTIONS[hoveredSection].y ?? 0, sectionHighlights.hovered.position.z)
//     sectionHighlights.hovered.needsUpdate = true;
//   }
// }
//
// function onResize() {
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   renderer.setSize(window.innerWidth, window.innerHeight);
//
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//
//   if (!transition) {
//     setCameraBase(getCameraState(activeSection));
//   }
// }
//
// function animate() {
//   const delta = Math.min(clock.getDelta(), 0.05);
//   const elapsed = clock.elapsedTime;
//
//   updateCamera(performance.now(), elapsed);
//   updateDust(delta, elapsed);
//   renderer.render(scene, camera);
//
//   requestAnimationFrame(animate);
// }
//
// function updateCamera(now, elapsed) {
//   if (transition) {
//     const t = THREE.MathUtils.clamp((now - transition.start) / transition.duration, 0, 1);
//     const eased = easeInOutCubic(t);
//     activeCameraBase.position.lerpVectors(transition.from.position, transition.to.position, eased);
//     activeCameraBase.target.lerpVectors(transition.from.target, transition.to.target, eased);
//     activeCameraBase.fov = THREE.MathUtils.lerp(transition.from.fov, transition.to.fov, eased);
//
//     if (t >= 1) {
//       setCameraBase(transition.to);
//       transition = null;
//     }
//   }
//
//   const idleAmount = prefersReducedMotion ? 0 : 1;
//   finalCameraPosition.copy(activeCameraBase.position);
//   finalCameraTarget.copy(activeCameraBase.target);
//
//   finalCameraPosition.x += parallax.x * 0.10 + Math.sin(elapsed * 0.45) * 0.025 * idleAmount;
//   finalCameraPosition.y += parallax.y * 0.055 + Math.cos(elapsed * 0.37) * 0.018 * idleAmount;
//   finalCameraTarget.x += parallax.x * 0.035;
//   finalCameraTarget.y += parallax.y * 0.025;
//
//   camera.position.copy(finalCameraPosition);
//   camera.fov = activeCameraBase.fov;
//   camera.updateProjectionMatrix();
//   camera.lookAt(finalCameraTarget);
// }
//
// function getCameraState(sectionName) {
//   const section = SECTIONS[sectionName];
//   const position = new THREE.Vector3(...section.camera.position);
//   const target = new THREE.Vector3(...section.camera.target);
//   let fov = section.camera.fov;
//
//   const minWidth = 750
//   position.z *= sectionName === 'overview' ? 2 * (minWidth/window.innerWidth) : 1.1
//   fov += sectionName === 'overview' ? 5 : 7;
//
//   // if (window.innerWidth < 760) {
//   //   position.z *= sectionName === 'overview' ? 1.28 : 1.38;
//   //   fov += sectionName === 'overview' ? 5 : 7;
//   // }
//
//   return { position, target, fov };
// }
//
// function setCameraBase(state) {
//   activeCameraBase.position.copy(state.position);
//   activeCameraBase.target.copy(state.target);
//   activeCameraBase.fov = state.fov;
// }
//
// function cloneCameraBase(state) {
//   return {
//     position: state.position.clone(),
//     target: state.target.clone(),
//     fov: state.fov,
//   };
// }
//
// function validSectionFromHash() {
//   const hash = window.location.hash.replace('#', '').trim();
//   return SECTIONS[hash] ? hash : null;
// }
//
// function createSubtleWarpedPlane(width, height, widthSegments, heightSegments, depth) {
//   const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
//   const positions = geometry.attributes.position;
//   const rnd = makeRandom(6067);
//
//   for (let i = 0; i < positions.count; i += 1) {
//     const x = positions.getX(i);
//     const y = positions.getY(i);
//     const wave = Math.sin(x * 1.7) * Math.cos(y * 1.9) * depth * 0.55;
//     const grain = (rnd() - 0.5) * depth;
//     positions.setZ(i, wave + grain);
//   }
//
//   geometry.computeVertexNormals();
//   return geometry;
// }
//
// function createBoardTexture() {
//   const width = 2400;
//   const height = Math.round(width * (BOARD.height / BOARD.width));
//   const canvas2d = document.createElement('canvas');
//   canvas2d.width = width;
//   canvas2d.height = height;
//   const ctx = canvas2d.getContext('2d');
//   const rnd = makeRandom(1731);
//
//   const base = ctx.createLinearGradient(0, 0, width, height);
//   base.addColorStop(0, '#144532');
//   base.addColorStop(0.38, '#0f3b2d');
//   base.addColorStop(0.72, '#0b3026');
//   base.addColorStop(1, '#08271f');
//   ctx.fillStyle = base;
//   ctx.fillRect(0, 0, width, height);
//
//   const radial = ctx.createRadialGradient(width * 0.52, height * 0.38, 80, width * 0.52, height * 0.38, width * 0.9);
//   radial.addColorStop(0, 'rgba(255,255,255,0.055)');
//   radial.addColorStop(0.52, 'rgba(255,255,255,0.012)');
//   radial.addColorStop(1, 'rgba(0,0,0,0.32)');
//   ctx.fillStyle = radial;
//   ctx.fillRect(0, 0, width, height);
//
//   for (let i = 0; i < 26000; i += 1) {
//     const alpha = rnd() * 0.055;
//     const size = rnd() < 0.86 ? 1 : 2 + rnd() * 2;
//     ctx.fillStyle = `rgba(255,255,235,${alpha})`;
//     ctx.fillRect(rnd() * width, rnd() * height, size, size);
//   }
//
//   for (let i = 0; i < 44; i += 1) {
//     drawSmudge(ctx, rnd() * width, rnd() * height, 90 + rnd() * 260, 18 + rnd() * 90, rnd() * Math.PI, rnd);
//   }
//
//   for (let i = 0; i < 18; i += 1) {
//     const y = rnd() * height;
//     const x = rnd() * width;
//     ctx.save();
//     ctx.translate(x, y);
//     ctx.rotate((rnd() - 0.5) * 0.35);
//     const grad = ctx.createLinearGradient(-280, 0, 280, 0);
//     grad.addColorStop(0, 'rgba(255,255,255,0)');
//     grad.addColorStop(0.5, `rgba(255,255,255,${0.035 + rnd() * 0.05})`);
//     grad.addColorStop(1, 'rgba(255,255,255,0)');
//     ctx.fillStyle = grad;
//     ctx.fillRect(-360, -12 - rnd() * 18, 720, 24 + rnd() * 26);
//     ctx.restore();
//   }
//
//   drawBoardConnectors(ctx, width, height, rnd);
//   drawGhostNotes(ctx, width, height, rnd);
//   drawBackgroundMathFragments(ctx, width, height, rnd);
//
//   const texture = new THREE.CanvasTexture(canvas2d);
//   texture.colorSpace = THREE.SRGBColorSpace;
//   texture.needsUpdate = true;
//   return texture;
// }
//
// function drawBoardConnectors(ctx, width, height, rnd) {
//   const overview = boardToCanvas(SECTIONS.overview.x, SECTIONS.overview.y, width, height);
//   const connections = ['mathResearch', 'quantum', 'papers', 'about'];
//
//   connections.forEach((key, index) => {
//     let target = boardToCanvas(SECTIONS[key].x, SECTIONS[key].y, width, height);
//
//     if (key === 'mathResearch') {
//       target = boardToCanvas(
//         SECTIONS.mathResearch.x + 1.25,
//         SECTIONS.mathResearch.y - 0.05,
//         width,
//         height,
//       );
//     }
//
//     if (key === 'quantum') {
//       target = boardToCanvas(
//         SECTIONS.quantum.x - 1.5,
//         SECTIONS.quantum.y + 1.1,
//         width,
//         height,
//       );
//     }
//
//     if (key === 'papers') {
//       target = boardToCanvas(
//         SECTIONS.papers.x + 1.25,
//         SECTIONS.papers.y - 0.05,
//         width,
//         height,
//       );
//     }
//
//     if (key === 'about') {
//       target = boardToCanvas(
//         SECTIONS.about.x - 1.9,
//         SECTIONS.about.y + 0.85,
//         width,
//         height,
//       );
//     }
//
//     const bend = index % 2 === 0 ? -1 : 1;
//     const c1 = [overview[0] + (target[0] - overview[0]) * 0.28, overview[1] + bend * 160];
//     const c2 = [overview[0] + (target[0] - overview[0]) * 0.7, target[1] - bend * 150];
//     drawChalkBezier(ctx, overview, c1, c2, target, 5.5, 0.13, rnd);
//     drawChalkArrowHead(ctx, c2, target, 0.13, rnd);
//   });
// }
//
// function drawGhostNotes(ctx, width, height, rnd) {
//   const notes = [];
//
//   ctx.save();
//   notes.forEach(([text, x, y, angle]) => {
//     ctx.save();
//     ctx.translate(width * x, height * y);
//     ctx.rotate(angle);
//     chalkText(ctx, text, 0, 0, {
//       size: 48,
//       alpha: 0.16,
//       align: 'center',
//       weight: 500,
//       rnd,
//     });
//     ctx.restore();
//   });
//   ctx.restore();
// }
//
// function drawBackgroundMathFragments(ctx, width, height, rnd) {
//   const fragments = [
//     {
//       kind: 'text', x: 0.6, y: 3.6, angle: -0.035, size: 38, alpha: 0.115,
//       lines: ['∂u/∂t = α∇²u', 'u(x,0) = f(x)'],
//     },
//     {
//       kind: 'text', x: -1.5, y: 2.98, angle: 0.045, size: 31, alpha: 0.085,
//       lines: ['λv = Av', 'det(A - λI) = 0'],
//     },
//     {
//       kind: 'text', x: 5.25, y: 3.56, angle: 0.08, size: 31, alpha: 0.08,
//       lines: ['∫Ω ∇·F dV', '= ∫∂Ω F·n dS'],
//     },
//     {
//       kind: 'text', x: -5.55, y: 3.84, angle: -0.08, size: 30, alpha: 0.075,
//       lines: ['ℒ = T - V', 'δ∫ ℒ dt = 0'],
//     },
//     {
//       kind: 'text', x: 6.85, y: 3.98, angle: 0.09, size: 29, alpha: 0.075,
//       lines: ['P(A|B)', '= P(B|A)P(A)/P(B)'],
//     },
//     {
//       kind: 'text', x: -6.0, y: 0.05, angle: 0.055, size: 31, alpha: 0.088,
//       lines: ['dx/dt = σ(y - x)', 'dy/dt = x(ρ - z) - y', 'dz/dt = xy - βz'],
//     },
//     {
//       kind: 'graph', x: 5.45, y: 0.01, angle: -0.05, scale: 1.0, alpha: 0.105,
//     },
//     {
//       kind: 'phase', x: 0.15, y: -3.55, angle: 0.025, scale: 1.0, alpha: 0.092,
//     },
//     {
//       kind: 'text', x: -1.9, y: -3.9, angle: -0.04, size: 30, alpha: 0.078,
//       lines: ['∀ε > 0 ∃δ > 0', '|x-a| < δ ⇒ |f(x)-L| < ε'],
//     },
//     {
//       kind: 'text', x: 2.2, y: -3.92, angle: 0.055, size: 31, alpha: 0.077,
//       lines: ['xₙ₊₁ = rxₙ(1 - xₙ)', '0 < r < 4'],
//     },
//     {
//       kind: 'vector', x: -0.05, y: 2.03, angle: 0.04, scale: 0.88, alpha: 0.17,
//     },
//     {
//       kind: 'text', x: -1.2, y: -2.1, angle: -0.2, size: 28, alpha: 0.09,
//       lines: ['Δf ≈ ∇f·Δx', 'H = JᵀJ + λI'],
//     },
//   ];
//
//   ctx.save();
//   fragments.forEach((fragment) => {
//     const [x, y] = boardToCanvas(fragment.x, fragment.y, width, height);
//     ctx.save();
//     ctx.translate(x, y);
//     ctx.rotate(fragment.angle);
//
//     if (fragment.kind === 'text') {
//       drawGhostFormulaBlock(ctx, fragment.lines, fragment.size, fragment.alpha, rnd);
//     }
//
//     if (fragment.kind === 'graph') {
//       drawGhostDirectedGraph(ctx, fragment.scale, fragment.alpha, rnd);
//     }
//
//     if (fragment.kind === 'phase') {
//       drawGhostPhaseSketch(ctx, fragment.scale, fragment.alpha, rnd);
//     }
//
//     if (fragment.kind === 'vector') {
//       drawGhostVectorField(ctx, fragment.scale, fragment.alpha, rnd);
//     }
//
//     ctx.restore();
//   });
//   ctx.restore();
// }
//
// function drawGhostFormulaBlock(ctx, lines, size, alpha, rnd) {
//   const lineGap = size * 1.22;
//   const startY = -((lines.length - 1) * lineGap) / 2;
//
//   lines.forEach((line, index) => {
//     greenChalkText(ctx, line, 0, startY + index * lineGap, {
//       size,
//       alpha: alpha * (0.9 + rnd() * 0.18),
//       align: 'center',
//       weight: 400,
//       rnd,
//     });
//   });
// }
//
// function drawGhostDirectedGraph(ctx, scale, alpha, rnd) {
//   ctx.save();
//   ctx.scale(scale, scale);
//
//   const nodes = [
//     { id: 'A', x: -78, y: -42 },
//     { id: 'B', x: 54, y: -54 },
//     { id: 'C', x: -28, y: 58 },
//     { id: 'D', x: 98, y: 42 },
//   ];
//   const edges = [
//     [0, 1], [0, 2], [1, 3], [2, 3], [2, 1],
//   ];
//
//   edges.forEach(([fromIndex, toIndex]) => {
//     const from = nodes[fromIndex];
//     const to = nodes[toIndex];
//     greenChalkLine(ctx, from.x, from.y, to.x, to.y, 3.1, alpha, rnd);
//     drawGreenArrowHead(ctx, [from.x, from.y], [to.x, to.y], alpha, rnd, 17);
//   });
//
//   nodes.forEach((node) => {
//     greenChalkCircle(ctx, node.x, node.y, 18, alpha * 1.05, rnd);
//     greenChalkText(ctx, node.id, node.x, node.y + 8, {
//       size: 22,
//       alpha: alpha * 1.35,
//       align: 'center',
//       weight: 400,
//       rnd,
//     });
//   });
//
//   greenChalkText(ctx, 'G = (V,E)', 6, 112, {
//     size: 25,
//     alpha: alpha * 0.92,
//     align: 'center',
//     weight: 400,
//     rnd,
//   });
//
//   ctx.restore();
// }
//
// function drawGhostPhaseSketch(ctx, scale, alpha, rnd) {
//   ctx.save();
//   ctx.scale(scale, scale);
//
//   greenChalkLine(ctx, -150, 0, 150, 0, 2.4, alpha * 0.75, rnd);
//   greenChalkLine(ctx, 0, 92, 0, -92, 2.4, alpha * 0.75, rnd);
//   drawGreenArrowHead(ctx, [-20, 0], [150, 0], alpha * 0.75, rnd, 16);
//   drawGreenArrowHead(ctx, [0, 20], [0, -92], alpha * 0.75, rnd, 16);
//
//   for (let pass = 0; pass < 4; pass += 1) {
//     ctx.save();
//     ctx.strokeStyle = `rgba(166,213,151,${alpha * (0.22 + rnd() * 0.18)})`;
//     ctx.lineWidth = 2.8 + rnd() * 2.1;
//     ctx.lineCap = 'round';
//     ctx.beginPath();
//     ctx.moveTo(-130 + jitter(rnd, 5), 50 + jitter(rnd, 5));
//     ctx.bezierCurveTo(
//       -64 + jitter(rnd, 8), -96 + jitter(rnd, 8),
//       72 + jitter(rnd, 8), -76 + jitter(rnd, 8),
//       126 + jitter(rnd, 5), 42 + jitter(rnd, 5),
//     );
//     ctx.stroke();
//     ctx.restore();
//   }
//
//   greenChalkText(ctx, 'dy/dx = F(x,y)', 0, -112, {
//     size: 25,
//     alpha: alpha * 0.98,
//     align: 'center',
//     weight: 400,
//     rnd,
//   });
//
//   ctx.restore();
// }
//
// function drawGhostVectorField(ctx, scale, alpha, rnd) {
//   ctx.save();
//   ctx.scale(scale, scale);
//
//   for (let row = -2; row <= 2; row += 1) {
//     for (let col = -4; col <= 4; col += 1) {
//       const x = col * 38;
//       const y = row * 32;
//       const angle = Math.atan2(row * 0.35, col * 0.3 + 0.8) + 0.45;
//       const len = 18 + rnd() * 7;
//       const x2 = x + Math.cos(angle) * len;
//       const y2 = y + Math.sin(angle) * len;
//       greenChalkLine(ctx, x, y, x2, y2, 2.2, alpha, rnd);
//       drawGreenArrowHead(ctx, [x, y], [x2, y2], alpha, rnd, 8);
//     }
//   }
//
//   greenChalkText(ctx, '∇φ', 0, 105, {
//     size: 25,
//     alpha,
//     align: 'center',
//     weight: 400,
//     rnd,
//   });
//
//   ctx.restore();
// }
//
// function greenChalkText(ctx, text, x, y, options) {
//   const {
//     size = 36,
//     alpha = 0.1,
//     align = 'center',
//     weight = 400,
//     rnd = Math.random,
//   } = options;
//
//   ctx.save();
//   ctx.font = `${weight} ${size}px ${CHALK_FONT_STACK}`;
//   ctx.textAlign = align;
//   ctx.textBaseline = 'alphabetic';
//   ctx.shadowColor = 'rgba(175,230,158,0.05)';
//   ctx.shadowBlur = 1.5;
//
//   for (let pass = 0; pass < 5; pass += 1) {
//     ctx.fillStyle = `rgba(166,213,151,${alpha * (0.19 + rnd() * 0.16)})`;
//     ctx.fillText(text, x + jitter(rnd, 1.8), y + jitter(rnd, 1.8));
//   }
//
//   ctx.fillStyle = `rgba(166,213,151,${alpha * 0.52})`;
//   ctx.fillText(text, x, y);
//   ctx.restore();
// }
//
// function greenChalkLine(ctx, x1, y1, x2, y2, width, alpha, rnd) {
//   for (let pass = 0; pass < 4; pass += 1) {
//     ctx.save();
//     ctx.strokeStyle = `rgba(166,213,151,${alpha * (0.18 + rnd() * 0.18)})`;
//     ctx.lineWidth = width * (0.55 + rnd() * 0.7);
//     ctx.lineCap = 'round';
//     ctx.beginPath();
//     ctx.moveTo(x1 + jitter(rnd, 3), y1 + jitter(rnd, 3));
//     ctx.lineTo(x2 + jitter(rnd, 3), y2 + jitter(rnd, 3));
//     ctx.stroke();
//     ctx.restore();
//   }
// }
//
// function greenChalkCircle(ctx, x, y, radius, alpha, rnd) {
//   for (let pass = 0; pass < 4; pass += 1) {
//     ctx.save();
//     ctx.strokeStyle = `rgba(166,213,151,${alpha * (0.18 + rnd() * 0.2)})`;
//     ctx.lineWidth = 2.6 + rnd() * 2;
//     ctx.beginPath();
//     ctx.ellipse(
//       x + jitter(rnd, 2),
//       y + jitter(rnd, 2),
//       radius + jitter(rnd, 2),
//       radius * (0.9 + rnd() * 0.16),
//       jitter(rnd, 0.12),
//       0,
//       Math.PI * 2,
//     );
//     ctx.stroke();
//     ctx.restore();
//   }
// }
//
// function drawGreenArrowHead(ctx, from, to, alpha, rnd, length = 18) {
//   const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
//   const left = [to[0] - Math.cos(angle - 0.55) * length, to[1] - Math.sin(angle - 0.55) * length];
//   const right = [to[0] - Math.cos(angle + 0.55) * length, to[1] - Math.sin(angle + 0.55) * length];
//   greenChalkLine(ctx, to[0], to[1], left[0], left[1], 2.4, alpha, rnd);
//   greenChalkLine(ctx, to[0], to[1], right[0], right[1], 2.4, alpha, rnd);
// }
//
// function createBoardBumpTexture() {
//   const size = 768;
//   const canvas2d = document.createElement('canvas');
//   canvas2d.width = size;
//   canvas2d.height = size;
//   const ctx = canvas2d.getContext('2d');
//   const image = ctx.createImageData(size, size);
//   const rnd = makeRandom(8922);
//
//   for (let i = 0; i < image.data.length; i += 4) {
//     const value = 105 + Math.floor(rnd() * 65);
//     image.data[i] = value;
//     image.data[i + 1] = value;
//     image.data[i + 2] = value;
//     image.data[i + 3] = 255;
//   }
//
//   ctx.putImageData(image, 0, 0);
//   const texture = new THREE.CanvasTexture(canvas2d);
//   texture.wrapS = THREE.RepeatWrapping;
//   texture.wrapT = THREE.RepeatWrapping;
//   texture.repeat.set(5, 3);
//   texture.needsUpdate = true;
//   return texture;
// }
//
// function createSectionTexture(key, section) {
//   const width = SECTION_TEXTURE_WIDTH;
//   const height = Math.round(width * (section.h / section.w));
//   const canvas2d = document.createElement('canvas');
//   canvas2d.width = width;
//   canvas2d.height = height;
//   const ctx = canvas2d.getContext('2d');
//   const rnd = makeRandom(hashString(key));
//
//   const padding = Math.max(52, Math.round(width * 0.055));
//   const extraTopHeight = padding * 1.25;
//
//   const center = Boolean(section.center);
//   const titleSize = center ? 112 : 92;
//   const lineSize = center ? 44 : PAPER_TITLE_SIZE+10;
//
//   const titleX = width / 2;
//   const titleAlign = 'center';
//   const bodyX = center ? width / 2 : width * BODY_MARGIN_RATIO;
//   const bodyAlign = center ? 'center' : 'left';
//
//   let y = center ? height * 0.39 : padding + 76;
//
//   if (key === 'overview' || section.center) {
//     drawScrawledBubble(
//       ctx,
//       width / 2,
//       height / 2 - 22,
//       width - padding * 1.15,
//       height - padding * 1.25 + extraTopHeight,
//       0.5,
//       rnd,
//     );
//   }
//
//   chalkText(ctx, section.title, titleX, y, {
//     size: titleSize,
//     alpha: 0.95,
//     align: titleAlign,
//     weight: 400,
//     rnd,
//   });
//
//   const underlineWidth = center
//     ? width * 0.44
//     : Math.min(
//         width * 0.46,
//         Math.max(width * 0.18, section.title.length * titleSize * 0.42),
//       );
//
//   drawChalkLine(
//     ctx,
//     titleX - underlineWidth / 2,
//     y + 26,
//     titleX + underlineWidth / 2,
//     y + 18 + rnd() * 8,
//     5.5,
//     0.62,
//     rnd,
//   );
//
//   y += center ? 74 : 78;
//
//   if (Array.isArray(section.papers) && section.papers.length > 0) {
//     drawPaperList(ctx, section.papers, bodyX, y, width, height, padding, rnd);
//   } else {
//     section.lines.forEach((line) => {
//       chalkText(ctx, line, bodyX, y, {
//         size: lineSize,
//         alpha: 0.84,
//         align: bodyAlign,
//         weight: 400,
//         rnd,
//       });
//
//       y += lineSize * 1.28;
//     });
//   }
//
//   if (!center) {
//     drawCornerDoodle(ctx, width - padding * 1.25, height - padding * 1.1, 0.72, rnd);
//   } else {
//     drawSmallStars(ctx, width, height, rnd);
//   }
//
//   erodeChalk(ctx, width, height, Math.floor((width * height) / 2600), rnd);
//
//   const texture = new THREE.CanvasTexture(canvas2d);
//   texture.colorSpace = THREE.SRGBColorSpace;
//   texture.needsUpdate = true;
//   return texture;
// }
//
// function createHighlightTexture(key, section) {
//   const width = 1050;
//   const height = Math.round(width * (section.h / section.w));
//   const canvas2d = document.createElement('canvas');
//   canvas2d.width = width;
//   canvas2d.height = height;
//   const ctx = canvas2d.getContext('2d');
//   const rnd = makeRandom(hashString(`${key}-highlight`));
//
//   const glow = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) * 0.55);
//   glow.addColorStop(0, 'rgba(220,255,203,0.08)');
//   glow.addColorStop(0.75, 'rgba(220,255,203,0.018)');
//   glow.addColorStop(1, 'rgba(220,255,203,0)');
//   ctx.fillStyle = glow;
//   ctx.fillRect(0, 0, width, height);
//
//   erodeChalk(ctx, width, height, Math.floor((width * height) / 3200), rnd);
//
//   const texture = new THREE.CanvasTexture(canvas2d);
//   texture.colorSpace = THREE.SRGBColorSpace;
//   texture.needsUpdate = true;
//   return texture;
// }
//
// function createWoodTexture(repeat, width=1024, height=256, baseCol='#674c3e', midCol='#614338') {
//   const canvas2d = document.createElement('canvas');
//   canvas2d.width = width * repeat;
//   canvas2d.height = height;
//   const ctx = canvas2d.getContext('2d');
//   const rnd = makeRandom(42);
//
//   for (let rep = 0; rep < repeat; rep++) {
//     const base = ctx.createLinearGradient(0, 0,  0, height);
//     base.addColorStop(0, baseCol);
//     base.addColorStop(rnd(), midCol);
//     base.addColorStop(1, baseCol);
//     ctx.fillStyle = base;
//     ctx.fillRect(rep * width, 0, (rep + 1) * width, height);
//
//     for (let i = 0; i < height/3; i += 1) {
//       const y = rnd() * height;
//       ctx.strokeStyle = `rgba(40,20,8,${0.08 + rnd() * 0.18})`;
//       ctx.lineWidth = 1 + rnd() * 3;
//       ctx.beginPath();
//       ctx.moveTo(rep * width, y);
//       for (let x = 0; x <= width; x += 64) {
//         ctx.lineTo(rep * width + x, y + Math.sin(x * 0.02 + rnd() * 6) * (5 + rnd() * 10));
//       }
//       ctx.stroke();
//     }
//
//     for (let i = 0; i < 16; i += 1) {
//       const r = 14 + rnd() * 38;
//       const x = rnd() * width
//       const y = rnd() * height
//       const grad = ctx.createRadialGradient(rep * width + x, y, 4, rep * width + x, y, r);
//       grad.addColorStop(0, 'rgba(35,17,7,0.23)');
//       grad.addColorStop(0.55, 'rgba(35,17,7,0.08)');
//       grad.addColorStop(1, 'rgba(35,17,7,0)');
//       ctx.fillStyle = grad;
//       ctx.beginPath();
//       ctx.ellipse(rep * width + x, y, r * 1.9, r * 0.7, rnd() * Math.PI, 0, Math.PI * 2);
//       ctx.fill();
//     }
//   }
//
//   const texture = new THREE.CanvasTexture(canvas2d);
//   texture.colorSpace = THREE.SRGBColorSpace;
//   texture.needsUpdate = true;
//   texture.wrapS = THREE.RepeatWrapping;
//   texture.wrapT = THREE.RepeatWrapping;
//   texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
//   return texture;
// }
//
// function createRoomTexture() {
//   const width = 1024;
//   const height = 640;
//   const canvas2d = document.createElement('canvas');
//   canvas2d.width = width;
//   canvas2d.height = height;
//   const ctx = canvas2d.getContext('2d');
//   const rnd = makeRandom(832);
//
//   const base = ctx.createLinearGradient(0, 0, width, height);
//   base.addColorStop(0, '#b9a4dd');
//   base.addColorStop(1, '#2e2b4c');
//   ctx.fillStyle = base;
//   ctx.fillRect(0, 0, width, height);
//
//   for (let i = 0; i < 7000; i += 1) {
//     ctx.fillStyle = `rgba(255,255,255,${rnd() * 0.018})`;
//     ctx.fillRect(rnd() * width, rnd() * height, 1, 1);
//   }
//
//   const texture = new THREE.CanvasTexture(canvas2d);
//   texture.colorSpace = THREE.SRGBColorSpace;
//   texture.needsUpdate = true;
//   return texture;
// }
//
// function createVignetteTexture(radius0=0.18, radius1=0.72) {
//   const size = 1024;
//   const canvas2d = document.createElement('canvas');
//   canvas2d.width = size;
//   canvas2d.height = size;
//   const ctx = canvas2d.getContext('2d');
//   const gradient = ctx.createRadialGradient(size / 2, size / 2, size * radius0, size / 2, size / 2, size * radius1);
//   gradient.addColorStop(0, 'rgba(0,0,0,0)');
//   gradient.addColorStop(0.62, 'rgba(0,0,0,0.05)');
//   gradient.addColorStop(1, 'rgba(0,0,0,0.48)');
//   ctx.fillStyle = gradient;
//   ctx.fillRect(0, 0, size, size);
//
//   const texture = new THREE.CanvasTexture(canvas2d);
//   texture.needsUpdate = true;
//   return texture;
// }
//
// function boardToCanvas(x, y, canvasWidth, canvasHeight) {
//   return [
//     (x / BOARD.width + 0.5) * canvasWidth,
//     (-y / BOARD.height + 0.5) * canvasHeight,
//   ];
// }
//
// function drawSmudge(ctx, x, y, rx, ry, rotation, rnd) {
//   ctx.save();
//   ctx.translate(x, y);
//   ctx.rotate(rotation);
//   const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
//   grad.addColorStop(0, `rgba(255,255,245,${0.045 + rnd() * 0.06})`);
//   grad.addColorStop(0.55, `rgba(255,255,245,${0.018 + rnd() * 0.025})`);
//   grad.addColorStop(1, 'rgba(255,255,245,0)');
//   ctx.scale(1, ry / rx);
//   ctx.fillStyle = grad;
//   ctx.beginPath();
//   ctx.arc(0, 0, rx, 0, Math.PI * 2);
//   ctx.fill();
//   ctx.restore();
// }
//
// function drawScrawledBubble(ctx, cx, cy, w, h, alpha, rnd) {
//   ctx.save();
//
//   ctx.lineCap = 'round';
//   ctx.lineJoin = 'round';
//   ctx.globalCompositeOperation = 'source-over';
//   ctx.shadowColor = 'rgba(255,255,255,0.10)';
//   ctx.shadowBlur = 1.4;
//
//   function x(v, amount = 0) {
//     return cx + v * (w / 2) + jitter(rnd, amount);
//   }
//
//   function y(v, amount = 0) {
//     return cy + v * (h / 2) + jitter(rnd, amount);
//   }
//
//   function drawCloudPath(jitterAmount) {
//     ctx.beginPath();
//     ctx.moveTo(x(-0.93, jitterAmount), y(0.04, jitterAmount));
//
//     ctx.bezierCurveTo(
//       x(-1.10, jitterAmount), y(-0.28, jitterAmount),
//       x(-0.86, jitterAmount), y(-0.55, jitterAmount),
//       x(-0.60, jitterAmount), y(-0.47, jitterAmount),
//     );
//
//     ctx.bezierCurveTo(
//       x(-0.55, jitterAmount), y(-0.82, jitterAmount),
//       x(-0.20, jitterAmount), y(-0.88, jitterAmount),
//       x(-0.08, jitterAmount), y(-0.64, jitterAmount),
//     );
//
//     ctx.bezierCurveTo(
//       x(0.04, jitterAmount), y(-1.04, jitterAmount),
//       x(0.42, jitterAmount), y(-0.98, jitterAmount),
//       x(0.38, jitterAmount), y(-0.62, jitterAmount),
//     );
//
//     ctx.bezierCurveTo(
//       x(0.66, jitterAmount), y(-0.72, jitterAmount),
//       x(0.88, jitterAmount), y(-0.48, jitterAmount),
//       x(0.76, jitterAmount), y(-0.20, jitterAmount),
//     );
//
//     ctx.bezierCurveTo(
//       x(1.05, jitterAmount), y(-0.12, jitterAmount),
//       x(1.06, jitterAmount), y(0.35, jitterAmount),
//       x(0.77, jitterAmount), y(0.38, jitterAmount),
//     );
//
//     ctx.bezierCurveTo(
//       x(0.78, jitterAmount), y(0.66, jitterAmount),
//       x(0.46, jitterAmount), y(0.78, jitterAmount),
//       x(0.33, jitterAmount), y(0.57, jitterAmount),
//     );
//
//     ctx.bezierCurveTo(
//       x(0.16, jitterAmount), y(0.77, jitterAmount),
//       x(-0.12, jitterAmount), y(0.74, jitterAmount),
//       x(-0.18, jitterAmount), y(0.55, jitterAmount),
//     );
//
//     ctx.bezierCurveTo(
//       x(-0.40, jitterAmount), y(0.73, jitterAmount),
//       x(-0.70, jitterAmount), y(0.60, jitterAmount),
//       x(-0.63, jitterAmount), y(0.35, jitterAmount),
//     );
//
//     ctx.bezierCurveTo(
//       x(-0.88, jitterAmount), y(0.40, jitterAmount),
//       x(-1.05, jitterAmount), y(0.25, jitterAmount),
//       x(-0.93, jitterAmount), y(0.04, jitterAmount),
//     );
//   }
//
//   for (let pass = 0; pass < 4; pass += 1) {
//     drawCloudPath(3.2);
//     ctx.strokeStyle = `rgba(248,247,226,${alpha * (0.18 + rnd() * 0.12)})`;
//     ctx.lineWidth = 3.7 + rnd() * 1.8;
//     ctx.stroke();
//   }
//
//   for (let pass = 0; pass < 2; pass += 1) {
//     drawCloudPath(4.6);
//     ctx.strokeStyle = `rgba(248,247,226,${alpha * (0.08 + rnd() * 0.05)})`;
//     ctx.lineWidth = 2.2 + rnd() * 1.1;
//     ctx.stroke();
//   }
//
//   for (let i = 0; i < 18; i += 1) {
//     const t = rnd() * Math.PI * 2;
//     const px = cx + Math.cos(t) * (w / 2) * (0.95 + rnd() * 0.16);
//     const py = cy + Math.sin(t) * (h / 2) * (0.75 + rnd() * 0.22);
//
//     ctx.beginPath();
//     ctx.moveTo(px + jitter(rnd, 2.5), py + jitter(rnd, 2.5));
//     ctx.lineTo(px + jitter(rnd, 6.5), py + jitter(rnd, 6.5));
//     ctx.strokeStyle = `rgba(248,247,226,${alpha * 0.06})`;
//     ctx.lineWidth = 1.4 + rnd() * 0.9;
//     ctx.stroke();
//   }
//
//   ctx.restore();
// }
//
// function drawRoughRect(ctx, x, y, width, height, radius, alpha, rnd, colorStart = 'rgba(248,247,226,') {
//   const r = Math.min(radius, width / 2, height / 2);
//   const corners = [
//     [x + r, y],
//     [x + width - r, y],
//     [x + width, y + r],
//     [x + width, y + height - r],
//     [x + width - r, y + height],
//     [x + r, y + height],
//     [x, y + height - r],
//     [x, y + r],
//   ];
//
//   for (let pass = 0; pass < 4; pass += 1) {
//     ctx.save();
//     ctx.strokeStyle = `${colorStart}${alpha * (0.22 + rnd() * 0.18)})`;
//     ctx.lineWidth = 4 + rnd() * 4;
//     ctx.lineCap = 'round';
//     ctx.lineJoin = 'round';
//     ctx.beginPath();
//     ctx.moveTo(corners[0][0] + jitter(rnd, 4), corners[0][1] + jitter(rnd, 4));
//     ctx.lineTo(corners[1][0] + jitter(rnd, 4), corners[1][1] + jitter(rnd, 4));
//     ctx.quadraticCurveTo(x + width + jitter(rnd, 4), y + jitter(rnd, 4), corners[2][0] + jitter(rnd, 4), corners[2][1] + jitter(rnd, 4));
//     ctx.lineTo(corners[3][0] + jitter(rnd, 4), corners[3][1] + jitter(rnd, 4));
//     ctx.quadraticCurveTo(x + width + jitter(rnd, 4), y + height + jitter(rnd, 4), corners[4][0] + jitter(rnd, 4), corners[4][1] + jitter(rnd, 4));
//     ctx.lineTo(corners[5][0] + jitter(rnd, 4), corners[5][1] + jitter(rnd, 4));
//     ctx.quadraticCurveTo(x + jitter(rnd, 4), y + height + jitter(rnd, 4), corners[6][0] + jitter(rnd, 4), corners[6][1] + jitter(rnd, 4));
//     ctx.lineTo(corners[7][0] + jitter(rnd, 4), corners[7][1] + jitter(rnd, 4));
//     ctx.quadraticCurveTo(x + jitter(rnd, 4), y + jitter(rnd, 4), corners[0][0] + jitter(rnd, 4), corners[0][1] + jitter(rnd, 4));
//     ctx.stroke();
//     ctx.restore();
//   }
// }
//
// function drawChalkLine(ctx, x1, y1, x2, y2, width, alpha, rnd) {
//   for (let pass = 0; pass < 5; pass += 1) {
//     ctx.save();
//     ctx.strokeStyle = `rgba(248,247,226,${alpha * (0.18 + rnd() * 0.16)})`;
//     ctx.lineWidth = width * (0.55 + rnd() * 0.65);
//     ctx.lineCap = 'round';
//     ctx.beginPath();
//     ctx.moveTo(x1 + jitter(rnd, 4), y1 + jitter(rnd, 4));
//     ctx.lineTo(x2 + jitter(rnd, 4), y2 + jitter(rnd, 4));
//     ctx.stroke();
//     ctx.restore();
//   }
// }
//
// function drawChalkBezier(ctx, p0, p1, p2, p3, width, alpha, rnd) {
//   for (let pass = 0; pass < 4; pass += 1) {
//     ctx.save();
//     ctx.strokeStyle = `rgba(248,247,226,${alpha * (0.32 + rnd() * 0.22)})`;
//     ctx.lineWidth = width * (0.6 + rnd() * 0.7);
//     ctx.lineCap = 'round';
//     ctx.beginPath();
//     ctx.moveTo(p0[0] + jitter(rnd, 8), p0[1] + jitter(rnd, 8));
//     ctx.bezierCurveTo(
//       p1[0] + jitter(rnd, 12), p1[1] + jitter(rnd, 12),
//       p2[0] + jitter(rnd, 12), p2[1] + jitter(rnd, 12),
//       p3[0] + jitter(rnd, 8), p3[1] + jitter(rnd, 8),
//     );
//     ctx.stroke();
//     ctx.restore();
//   }
// }
//
// function drawChalkArrowHead(ctx, from, to, alpha, rnd) {
//   const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
//   const length = 42;
//   const left = [to[0] - Math.cos(angle - 0.55) * length, to[1] - Math.sin(angle - 0.55) * length];
//   const right = [to[0] - Math.cos(angle + 0.55) * length, to[1] - Math.sin(angle + 0.55) * length];
//   drawChalkLine(ctx, to[0], to[1], left[0], left[1], 5, alpha, rnd);
//   drawChalkLine(ctx, to[0], to[1], right[0], right[1], 5, alpha, rnd);
// }
//
// function drawPaperList(ctx, papers, x, startY, width, height, padding, rnd) {
//   let y = startY - 4;
//
//   papers.forEach((paper) => {
//     chalkText(ctx, paper.title, x, y, {
//       size: PAPER_TITLE_SIZE,
//       alpha: 0.9,
//       align: 'left',
//       weight: 400,
//       rnd,
//     });
//
//     ctx.save();
//     ctx.font = `400 ${PAPER_TITLE_SIZE}px ${CHALK_FONT_STACK}`;
//     const titleWidth = Math.min(
//       ctx.measureText(paper.title).width,
//       width - x - padding,
//     );
//     ctx.restore();
//
//     drawChalkLine(
//       ctx,
//       x,
//       y + 8,
//       x + titleWidth,
//       y + 8 + jitter(rnd, 3),
//       2.4,
//       0.42,
//       rnd,
//     );
//
//     chalkText(ctx, paper.authors, x + 34, y + 27, {
//       size: PAPER_AUTHOR_SIZE,
//       alpha: 0.72,
//       align: 'left',
//       weight: 400,
//       rnd,
//     });
//
//     y += PAPER_ENTRY_GAP;
//   });
// }
//
// function chalkText(ctx, text, x, y, options) {
//   const {
//     size = 48,
//     alpha = 0.9,
//     align = 'left',
//     weight = 400,
//     rnd = Math.random,
//   } = options;
//
//   ctx.save();
//   ctx.font = `${weight} ${size}px ${CHALK_FONT_STACK}`;
//   ctx.textAlign = align;
//   ctx.textBaseline = 'alphabetic';
//   ctx.lineJoin = 'round';
//   ctx.shadowColor = 'rgba(255,255,255,0.12)';
//   ctx.shadowBlur = 1.4;
//
//   for (let pass = 0; pass < 5; pass += 1) {
//     ctx.fillStyle = `rgba(248,247,226,${alpha * (0.10 + rnd() * 0.075)})`;
//     ctx.fillText(text, x + jitter(rnd, 2.0), y + jitter(rnd, 2.0));
//   }
//
//   ctx.fillStyle = `rgba(248,247,226,${alpha * 0.70})`;
//   ctx.fillText(text, x, y);
//
//   ctx.fillStyle = `rgba(248,247,226,${alpha * 0.12})`;
//   ctx.fillText(text, x + jitter(rnd, 1.1), y + jitter(rnd, 1.1));
//
//   ctx.restore();
// }
//
// function drawCornerDoodle(ctx, x, y, scale, rnd) {
//   ctx.save();
//   ctx.translate(x, y);
//   ctx.rotate(-0.24 + rnd() * 0.12);
//   ctx.scale(scale, scale);
//   drawChalkLine(ctx, -38, -20, 28, -20, 4, 0.32, rnd);
//   drawChalkLine(ctx, 28, -20, 8, -38, 4, 0.32, rnd);
//   drawChalkLine(ctx, 28, -20, 8, -2, 4, 0.32, rnd);
//   ctx.restore();
// }
//
// function drawSmallStars(ctx, width, height, rnd) {
//   for (let i = 0; i < 9; i += 1) {
//     const x = width * (0.17 + rnd() * 0.66);
//     const y = height * (0.15 + rnd() * 0.68);
//     const size = 7 + rnd() * 14;
//     drawChalkLine(ctx, x - size, y, x + size, y, 3, 0.2, rnd);
//     drawChalkLine(ctx, x, y - size, x, y + size, 3, 0.2, rnd);
//   }
// }
//
// function erodeChalk(ctx, width, height, count, rnd) {
//   ctx.save();
//   ctx.globalCompositeOperation = 'destination-out';
//   for (let i = 0; i < count; i += 1) {
//     const radius = 0.4 + rnd() * 2.1;
//     ctx.fillStyle = `rgba(0,0,0,${0.08 + rnd() * 0.42})`;
//     ctx.beginPath();
//     ctx.arc(rnd() * width, rnd() * height, radius, 0, Math.PI * 2);
//     ctx.fill();
//   }
//   ctx.restore();
// }
//
// function jitter(rnd, amount) {
//   return (rnd() - 0.5) * amount;
// }
//
// function easeInOutCubic(t) {
//   return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// }
//
// function hashString(value) {
//   let hash = 2166136261;
//   for (let i = 0; i < value.length; i += 1) {
//     hash ^= value.charCodeAt(i);
//     hash = Math.imul(hash, 16777619);
//   }
//   return hash >>> 0;
// }
//
// function makeRandom(seed) {
//   let value = seed >>> 0;
//   return function random() {
//     value += 0x6d2b79f5;
//     let t = value;
//     t = Math.imul(t ^ (t >>> 15), t | 1);
//     t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
//     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//   };
// }