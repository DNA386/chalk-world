import * as THREE from "three";
import { makeRandom } from "../utils/utils";
import { BOARD } from "./consts";

export default class DustField {
  points: THREE.Points;
  speeds: Float32Array;
  phases: Float32Array;

  constructor() {
    const count = 560;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    const rnd = makeRandom(9403);

    for (let i = 0; i < count; i += 1) {
      const j = i * 3;
      positions[j] = (rnd() - 0.5) * 20.5;
      positions[j + 1] = (rnd() - 0.5) * 15.8;
      positions[j + 2] = 0.35 + rnd() * 7.5;
      speeds[i] = 0.035 + rnd() * 0.08;
      phases[i] = rnd() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: '#e9ffd0',
      size: 0.02,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    points.renderOrder = 20;

    this.points = points
    this.speeds = speeds
    this.phases = phases
  }

  update(delta, elapsed) {
    const positions = this.points.geometry.attributes.position.array;
    for (let i = 0; i < this.speeds.length; i += 1) {
      const j = i * 3;
      positions[j + 1] += this.speeds[i] * delta;
      positions[j] += Math.sin(elapsed * 0.55 + this.phases[i]) * 0.006 * delta;

      if (positions[j + 1] > BOARD.height / 2 + 1.1) {
        positions[j + 1] = -BOARD.height / 2 - 1.25;
      }
    }

    this.points.geometry.attributes.position.needsUpdate = true;
  }

}