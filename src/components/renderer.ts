import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import Environment from './environment';
import Camera from './camera';
// import UIEventBus from './UI/EventBus';
// @ts-ignore
import screenVert from './Shaders/screen/vertex.glsl';
// @ts-ignore
import screenFrag from './Shaders/screen/fragment.glsl';

export default class Renderer {
  environment: Environment;
  scene: THREE.Scene;
  cssScene: THREE.Scene;
  // overlay: THREE.Mesh;
  // overlayScene: THREE.Scene;
  camera: Camera;
  // overlayInstance: THREE.WebGLRenderer;
  instance: THREE.WebGLRenderer;
  cssInstance: CSS3DRenderer;
  raiseExposure: boolean;
  uniforms: {
    [uniform: string]: THREE.IUniform<any>;
  };

  constructor(environment: Environment) {
    this.environment = environment;
    this.scene = this.environment.scene;
    this.cssScene = this.environment.cssScene;
    // this.overlayScene = this.environment.overlayScene;
    this.camera = this.environment.camera;

    this.setInstance();
  }

  setInstance() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.instance = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    // Settings
    // this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1.3
    this.instance.setSize(width, height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.instance.setClearColor("#ffffff", 0.0);

    // Style
    this.instance.domElement.style.position = 'absolute';
    this.instance.domElement.style.zIndex = '1px';
    this.instance.domElement.style.top = '0px';

    document.querySelector('#webgl')?.appendChild(this.instance.domElement);

    // this.overlayInstance = new THREE.WebGLRenderer();
    // this.overlayInstance.setSize(this.sizes.width, this.sizes.height);
    // this.overlayInstance.domElement.style.position = 'absolute';
    // this.overlayInstance.domElement.style.top = '0px';
    // this.overlayInstance.domElement.style.mixBlendMode = 'soft-light';
    // this.overlayInstance.domElement.style.opacity = '0.12';
    // this.overlayInstance.domElement.style.mixBlendMode = 'luminosity';
    // this.overlayInstance.domElement.style.opacity = '1';
    // this.overlayInstance.domElement.style.pointerEvents = 'none';

    // document
    //   .querySelector('#overlay')
    //   ?.appendChild(this.overlayInstance.domElement);

    this.cssInstance = new CSS3DRenderer();
    this.cssInstance.setSize(width, height);
    this.cssInstance.domElement.style.position = 'absolute';
    this.cssInstance.domElement.style.top = '0px';

    document.querySelector('#css')?.appendChild(this.cssInstance.domElement);

    this.uniforms = {
      u_time: { value: 1 },
    };

    // this.overlay = new THREE.Mesh(
    //   new THREE.PlaneGeometry(10000, 10000),
    //   new THREE.ShaderMaterial({
    //     vertexShader: screenVert,
    //     fragmentShader: screenFrag,
    //     uniforms: this.uniforms,
    //     depthTest: false,
    //     depthWrite: false,
    //   })
    // );
    //
    // this.overlayScene.add(this.overlay);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.instance.setSize(width, height);

    this.cssInstance.setSize(width, height);

    // this.overlayInstance.setSize(width, height);
    // this.overlayInstance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  update() {
    this.environment.camera.camera.updateProjectionMatrix();
    if (this.uniforms) {
      this.uniforms.u_time.value = Math.sin(performance.now() * 0.01);
    }

    this.instance.render(this.scene, this.camera.camera);
    this.cssInstance.render(this.cssScene, this.camera.camera);
    // this.overlayInstance.render(this.overlayScene, this.camera.camera);
    // this.overlay.position.copy(this.camera.camera.position);
  }

  render() {
    this.instance.render(this.scene, this.camera.camera);
    this.cssInstance.render(this.cssScene, this.camera.camera);
  }
}
