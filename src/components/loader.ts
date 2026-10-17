import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


async function importGLTF(scene: THREE.Scene) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync( 'src/public/blender_scene.gltf' );

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
