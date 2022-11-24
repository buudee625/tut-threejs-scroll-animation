console.log('JS loaded');
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// Load custom objects
const loader = new OBJLoader();
loader.load(
  'obj/MusicNote.obj',
  function (object) {
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  function (error) {
    console.log('An error happened');
  }
);
