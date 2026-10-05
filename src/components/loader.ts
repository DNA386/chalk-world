import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


async function loadFonts() {
  try {
    if (document.fonts) {
      await Promise.all([
        document.fonts.load('500 112px "Caveat"', 'Colin Krawchuk'),
        document.fonts.load('500 92px "Caveat"', 'Quantum'),
        document.fonts.load('400 44px "Caveat"', 'academic and professional work'),
        document.fonts.load('400 42px "Caveat"', 'Math interests'),
        document.fonts.load('400 31px "Caveat"', 'math'),
      ]);

      await document.fonts.ready;
    }
  } catch (error) {
    console.warn('Font loading failed; using fallback fonts.', error);
  }
}


async function importGLTF(scene: THREE.Scene) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync( 'src/blender_scene.gltf' );

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
    loadFonts(),
    importGLTF(scene),
  ])
}

export default loadAssets;
