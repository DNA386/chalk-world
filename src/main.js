import './style.css';

import loadAssets from './components/loader'
import Environment from './components/environment'

async function loadThenStart() {
  const environment = new Environment();
  await loadAssets(environment.scene);
  environment.init();
  environment.animate();
}

loadThenStart();
