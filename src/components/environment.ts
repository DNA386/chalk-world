import * as THREE from 'three';

import Camera, { CameraTransition } from './camera';
import Renderer from './renderer';
import BlackboardContent from "./blackboard";
import DustField from "./dust";
import {addLights, Highlight} from "./lights";
import { BOARD, NAVIGATION } from "./consts"

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

    // Global access
    //@ts-ignore
    // window.Application = this;

    this.clock = new THREE.Timer();

    // Setup
    // this.debug = new Debug();
    // this.sizes = new Sizes();
    // this.mouse = new Mouse();
    // this.loading = new Loading();
    // this.time = new Time();
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
    // this.renderer = new THREE.WebGLRenderer({
    //   canvas: this.canvas,
    //   antialias: true,
    //   powerPreference: 'high-performance',
    // });
    // this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // this.renderer.toneMappingExposure = 1.03;


    this.raycaster = new THREE.Raycaster();
    this.interactiveMeshes = [];
    this.wall = null;
    this.hovered = null;

    this.pointer = new THREE.Vector2(0, 0);
    this.pointer3D = new THREE.Vector3(0, 0);

    // Populate the scene
    addLights(this.scene);
    this.highlight = new Highlight(this.scene);

    console.log("added lights", this.scene)

    // Call only once this has been sufficiently well populated
    this.blackboard = new BlackboardContent(this);

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


    // this.camera.createControls();
    // this.world = new World();

    // this.ui = new UI();

    // const urlParams = new URLSearchParams(window.location.search);
    // if (urlParams.has('debug')) {
    //   this.stats = new Stats();
    //   this.stats.showPanel(0);
    //
    //   document.body.appendChild(this.stats.dom);
    // }

    // Resize event
    window.addEventListener('resize', () => this.resize())
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('click', (e) => this.onClick(e));

    // this.sizes.on('resize', () => {
    //   this.resize();
    // });

    // // Time tick event
    // this.time.on('tick', () => {
    //   this.update();
    // });
  }

  resize() {
    this.renderer.resize()
    this.camera.resize(true, this.blackboard.sectionNav.activeSection)
  }

  onPointerMove(event: PointerEvent) {
    const rect = this.renderer.instance.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.camera.onPointerMove(this.pointer)

    this.raycaster.setFromCamera(this.pointer, this.camera.camera);
    this.hovered = this.raycaster.intersectObjects(this.interactiveMeshes, false)[0];
    const wallHit: THREE.Intersection = this.raycaster.intersectObjects([this.wall], false)[0];
    if (wallHit) {
      this.pointer3D.copy(wallHit?.point)
    }

    this.highlight.highlightInteractiveObject(this.hovered)
  }

  onClick(event: PointerEvent) {
    if (this.hovered) {
      this.blackboard.messageBoard({
        type: "navigate",
        destination: NAVIGATION[this.hovered.object.name].url,
      })
    }
  }

  init() {
    // Gl scene elements have now been loaded.
    this.blackboard.alignCssPlane()
    this.scene.traverse((element) => {
      // Physical objects linked to navigation in the blackboard site
      if (Object.keys(NAVIGATION).includes(element.name)) {
        this.interactiveMeshes.push(element)
      }
    })
    this.wall = this.scene.getObjectByName("wall");
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

  destroy() {
    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }
      }
    });

    this.renderer.instance.dispose();
  }
}