import * as THREE from "three";


export function addLights(scene: THREE.Scene) {

    const ambientLight = new THREE.AmbientLight( '#f5e8ff', 1.3 );
    scene.add( ambientLight );

    const hemisphere = new THREE.HemisphereLight(
        '#daffd8',
        '#1f4c2c',
        0.73
    );
    scene.add(hemisphere);

    const key = new THREE.DirectionalLight('#efffea', 0.18);
    key.position.set(-3.9, 2.4, 5.5);
    key.castShadow = true;
    key.shadow.radius = 10;
    key.shadow.mapSize.set(2**13, 2**13);
    key.shadow.camera.left = -8;
    key.shadow.camera.right = 8;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -8;
    key.shadow.camera.near = 0;
    key.shadow.camera.far = 20;
    scene.add(key);
    // scene.add(new THREE.CameraHelper(key.shadow.camera))

    // const key2 = new THREE.DirectionalLight('#cfc1f6', 1);
    // key2.position.set(1, 3.5, 7.8);
    // key2.castShadow = true;
    // key2.shadow.radius = 5;
    // key2.shadow.mapSize.set(2048, 2048);
    // key2.shadow.camera.left = -8;
    // key2.shadow.camera.right = 8;
    // key2.shadow.camera.top = 6;
    // key2.shadow.camera.bottom = -7;
    // key2.shadow.camera.near = 5;
    // key2.shadow.camera.far = 12;
    // scene.add(key2);
    // scene.add(new THREE.CameraHelper(key2.shadow.camera))


    const rim = new THREE.PointLight('#fff6c5', 1000, 25);
    rim.position.set(1, 4.5, 20);
    rim.castShadow = true;
    rim.shadow.radius = 30;
    rim.shadow.mapSize.set(2**12, 2**12);
    rim.shadow.camera.near = 19;
    rim.shadow.camera.far = 25;
    scene.add(rim);
    // scene.add(new THREE.CameraHelper(rim.shadow.camera))
    // scene.add(new THREE.PointLightHelper(rim))
}

export class Highlight {
    light: THREE.PointLight;
    isOn: boolean = false;
    maxIntensity: number;
    minIntensity: number;
    fadeTime: number;

    constructor(scene: THREE.Scene) {
        this.isOn = false
        this.maxIntensity = 10;
        this.minIntensity = 1;
        this.fadeTime = 0.1;

        this.light = new THREE.PointLight('#6F62AC', this.minIntensity, 10, 2)
        this.light.position.set(0, 0, 0.5);
        this.light.castShadow = true;
        this.light.shadow.radius = 30;
        this.light.shadow.mapSize.set(2**10, 2**10);
        this.light.shadow.camera.near = 0;
        this.light.shadow.camera.far = 5;
        this.light.name = "highlight"
        scene.add(this.light);
        // scene.add(new THREE.PointLightHelper(this.light))
    }

    update(delta: number, pointer: THREE.Vector3) {
        // Light always follows the cursor
        this.light.position.copy(pointer)
        this.light.position.z = 1.3

        // Smooth On/Off
        if (
          (this.isOn && this.light.intensity < this.maxIntensity) ||
          (!this.isOn && this.light.intensity > this.minIntensity)
        ) {
            const adjustment = this.isOn ? delta / this.fadeTime : -delta / this.fadeTime;
            this.light.intensity = THREE.MathUtils.clamp(
              this.light.intensity + adjustment * (this.maxIntensity - this.minIntensity),
              this.minIntensity, this.maxIntensity,
            )
        }
    }
    highlightInteractiveObject(hit?: THREE.Intersection) {
        // Shine a light on it
        this.isOn = !!hit;
    }
}