import * as THREE from 'three';

import { easeInOutCubic } from "../utils/utils";
import { BOARD } from './consts'
import {SectionNavConf} from "./sectionNav";

export type CameraTransition = {
  start: number,
  from: {position: THREE.Vector3, target: THREE.Vector3, fov: number},
  to: {position: THREE.Vector3, target: THREE.Vector3, fov: number},
  duration: number,
}

export type CameraState = {
  position: THREE.Vector3,
  target: THREE.Vector3,
  fov: number,
}


export default class Camera {
  camera: THREE.PerspectiveCamera;
  parallax: THREE.Vector2;
  finalCameraPosition: THREE.Vector3;
  finalCameraTarget: THREE.Vector3;
  activeCameraBase: CameraState;
  prefersReducedMotion: boolean;
  transition: CameraTransition;

  constructor(prefersReducedMotion: boolean = false) {
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      80
    );
    this.transition = null;

    this.activeCameraBase = {
      position: new THREE.Vector3(),
      target: new THREE.Vector3(),
      fov: 40,
    };
    this.parallax = new THREE.Vector2(0, 0);
    this.finalCameraPosition = new THREE.Vector3();
    this.finalCameraTarget = new THREE.Vector3();
    this.prefersReducedMotion = prefersReducedMotion;
  }

  resize(immediate: boolean = true, activeSection: {name: string, section: SectionNavConf}) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    if (immediate) {
      this.setCameraBase(this.getCameraState(activeSection.name, activeSection.section));
    }
  }

  onPointerMove(pointer: THREE.Vector2) {
    this.parallax.x = THREE.MathUtils.clamp(pointer.x, -1, 1);
    this.parallax.y = THREE.MathUtils.clamp(pointer.y, -1, 1);
  }

  update(now: number, elapsed: number) {
    if (this.transition) {
      const t = THREE.MathUtils.clamp((now - this.transition.start) / this.transition.duration, 0, 1);
      const eased = easeInOutCubic(t);
      this.activeCameraBase.position.lerpVectors(this.transition.from.position, this.transition.to.position, eased);
      this.activeCameraBase.target.lerpVectors(this.transition.from.target, this.transition.to.target, eased);
      this.activeCameraBase.fov = THREE.MathUtils.lerp(this.transition.from.fov, this.transition.to.fov, eased);

      if (t >= 1) {
        this.setCameraBase(this.transition.to);
        this.transition = null;
      }
    }

    const idleAmount = this.prefersReducedMotion ? 0 : 1;
    this.finalCameraPosition.copy(this.activeCameraBase.position);
    this.finalCameraTarget.copy(this.activeCameraBase.target);

    this.finalCameraPosition.x += this.parallax.x * 0.20 + Math.sin(elapsed * 0.45) * 0.025 * idleAmount;
    this.finalCameraPosition.y += this.parallax.y * 0.155 + Math.cos(elapsed * 0.37) * 0.018 * idleAmount;
    this.finalCameraTarget.x += this.parallax.x * 0.035;
    this.finalCameraTarget.y += this.parallax.y * 0.025;

    this.camera.position.copy(this.finalCameraPosition);
    this.camera.fov = this.activeCameraBase.fov;
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(this.finalCameraTarget);
  }

  setCameraBase(state: CameraState) {
    this.activeCameraBase.position.copy(state.position);
    this.activeCameraBase.target.copy(state.target);
    this.activeCameraBase.fov = state.fov;
  }

  cloneCameraBase(state: CameraState | null) {
    if (state === null) {
      state = this.activeCameraBase;
    }
    return {
      position: state.position.clone(),
      target: state.target.clone(),
      fov: state.fov,
    } as CameraState;
  }

  getCameraState(sectionName, section) {
    const position = new THREE.Vector3(...section.camera.position);
    const target = new THREE.Vector3(...section.camera.target);
    let fov = section.camera.fov;

    const baseWidth = BOARD.width * BOARD.pixelRatio + 10
    const baseHeight = BOARD.height * BOARD.pixelRatio + 10 // room padding
    const minClient = Math.max(
      (baseWidth / baseHeight) / (window.innerWidth / window.innerHeight),
      (baseHeight / baseWidth) / (window.innerHeight / window.innerWidth),
    );
    position.z *= sectionName === 'overview' ? minClient : 1.1
    fov += sectionName === 'overview' ? 1 : 7;

    // if (window.innerWidth < 760) {
    //   position.z *= sectionName === 'overview' ? 1.28 : 1.38;
    //   fov += sectionName === 'overview' ? 5 : 7;
    // }

    return {position, target, fov} as CameraState;
  }

}