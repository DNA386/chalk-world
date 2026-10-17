import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import sceneURL from


async function importGLTF(scene: THREE.Scene) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(import.meta.env.BASE_URL + 'blender_scene.gltf');

  gltf.scene.children.forEach(child => {
    if (child.name !== "wall") {
      child.castShadow = true;
    }
    child.receiveShadow = true;
  })

  scene.add( gltf.scene );
}

async function loadAssets(scene: THREE.Scene) {
  await Promise.all([
    importGLTF(scene),
  ])
}

export default loadAssets;
