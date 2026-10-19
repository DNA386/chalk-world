import * as THREE from 'three';

import Camera from './camera';
import Renderer from './renderer';
import BlackboardContent from "./blackboard";
import DustField from "./dust";
import {addLights, Highlight} from "./lights";
import { BOARD, NAVIGATION, INITIAL_SECTION } from "./consts"
import addDrawingNavigation from './drawingNavigation';

let instance: boolean = false;

export default class Environment {
  scene: THREE.Scene;
  cssScene: THREE.Scene;
  overlayScene: THREE.Scene;
  camera: Camera;
  renderer: Renderer;
  prefersReducedMotion: boolean;
  canvas: HTMLCanvasElement;
  blackboard: BlackboardContent;

  raycaster: THREE.Raycaster;
  interactiveMeshes: THREE.Mesh[];
  wall: THREE.Mesh;
  highlight: Highlight;
  pointer: THREE.Vector2;
  pointer3D: THREE.Vector3;
  hovered: THREE.Intersection;
  clock: THREE.Timer;
  dustField: DustField;

  constructor() {
    // Singleton
    if (instance) {
      throw new Error("Tried to create a second environment!");
    }
    instance = true;

    this.clock = new THREE.Timer();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#050706");
    this.scene.fog = new THREE.FogExp2("#070a08", 0.026);

    this.dustField = new DustField()
    this.scene.add(this.dustField.points);

    this.cssScene = new THREE.Scene();
    // Convert gl scene units to css scene pixels
    this.cssScene.scale.set(1/BOARD.pixelRatio, 1/BOARD.pixelRatio, 1/BOARD.pixelRatio)
    this.overlayScene = new THREE.Scene();

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.canvas = document.querySelector('#scene');

    // this.resources = new Resources(sources);
    this.camera = new Camera(this.prefersReducedMotion);
    this.renderer = new Renderer(this);

    this.raycaster = new THREE.Raycaster();
    this.interactiveMeshes = [];
    this.wall = null;
    this.hovered = null;

    this.pointer = new THREE.Vector2(0, 0);
    this.pointer3D = new THREE.Vector3(0, 0);

    // Populate the scene
    addLights(this.scene);
    this.highlight = new Highlight(this.scene);

    // Call only once this has been sufficiently well populated
    this.blackboard = new BlackboardContent(this);

    // Resize event
    window.addEventListener('resize', () => this.resize())
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('click', (e) => this.onClick(e));
  }

  resize() {
    this.renderer.resize()
    this.camera.resize(true, {
      name: this.blackboard.sectionNav.activeSection,
      section: this.blackboard.sectionNav.allSections[this.blackboard.sectionNav.activeSection]
    })
  }

  onPointerMove(event: PointerEvent) {
    const rect = this.renderer.instance.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.camera.onPointerMove(this.pointer)

    this.raycaster.setFromCamera(this.pointer, this.camera.camera);
    this.hovered = this.raycaster.intersectObjects(this.interactiveMeshes, false)[0];
    const wallHit: THREE.Intersection | undefined = this.wall ? this.raycaster.intersectObjects([this.wall], false)[0] : undefined;
    if (wallHit) {
      this.pointer3D.copy(wallHit?.point)
    }

    this.highlight.highlightInteractiveObject(this.hovered)
  }

  onClick(event: PointerEvent) {
    this.onPointerMove(event);
    if (this.hovered) {
      this.blackboard.messageBoard({
        type: "navigate",
        destination: NAVIGATION[this.hovered.object.name].url,
      })
    } else {
      this.blackboard.sectionNav.goToSection(INITIAL_SECTION, {immediate: false, updateHash: true})
    }

  }

  init() {
    // Gl scene elements have now been loaded.
    addDrawingNavigation(this.scene);
    this.blackboard.alignCssPlane()
    this.scene.traverse((element) => {
      // Physical objects linked to navigation in the blackboard site
      if (Object.keys(NAVIGATION).includes(element.name)) {
        this.interactiveMeshes.push(element)
      }
    })
    this.wall = this.scene.getObjectByName("wall");
    this.blackboard.configureNavigation();
  }

  animate() {
    const delta = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.getElapsed();

    this.camera.update(performance.now(), elapsed);
    this.dustField.update(delta, elapsed);
    this.highlight.update(delta, this.pointer3D);
    this.renderer.render();

    this.clock.update()

    requestAnimationFrame(() => this.animate());
  }
}