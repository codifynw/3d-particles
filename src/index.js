import * as THREE from 'three'
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Model from './model'

let tick = 0;

/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
  antialias: false,
  alpha: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
  50, 
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 5;
camera.position.y = 1;
scene.add(camera);


/*------------------------------
Mesh
------------------------------*/
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial( { 
  color: 0x00ff00,
} );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls( camera, renderer.domElement );


/*------------------------------
Helpers
------------------------------*/
// const gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

/*------------------------------
Models
------------------------------*/
const skull = new Model({
  name: 'skull',
  url: './models/skull.glb',
  scene: scene,
  placeOnLoad: false,
  color1: 'red',
  color2: 'blue',
  background: 'black',
  type: 'obj',
  camera: camera,
});

const horse = new Model({
  name: 'horse',
  url: './models/horse.glb',
  scene: scene,
  placeOnLoad: false,
  color1: 'black',
  color2: 'red',
  background: 'silver',
  type: 'obj',
});

const plane = new Model({
  name: 'plane',
  placeOnLoad: true,
  type: 'generated',
  scene: scene,
  color1: 'red',
  color2: 'red',
  background: 'black',
});

const models = {skull: skull, horse: horse,plane: plane};

/*------------------------------
Controllers
------------------------------*/
const buttons = document.querySelectorAll('button');
let hoveringButton = false;

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("mouseenter", () => {
    debugger
    hoveringButton = true;
    if (models.plane.isActive) {
      models.plane.remove();
    }
    const modelName = button.getAttribute("data-model");
    if (!models[modelName].isActive) {
      models[modelName].add();
    }
  });

  button.addEventListener("mouseleave", () => {
    const modelName = button.getAttribute("data-model");
    if (models[modelName].isActive) {
      models[modelName].remove();
    }
    hoveringButton = false;
    setTimeout(() => {
      if (!hoveringButton && !models.plane.isActive) {
        models.plane.add();
      }
    }, 0);
  });
});

/*------------------------------
Clock
------------------------------*/
const clock = new THREE.Clock();

/*------------------------------
Loop
------------------------------*/
const animate = function () {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );

  if (skull.isActive) {
    skull.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime();
  }

  if (horse.isActive) {
    horse.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime();
  }

  if (plane.isActive) {
    plane.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime();
  }  

  tick++
};
animate();


/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

// MOUSE MOVE
function onMouseMove(event) {
  // Update the mouse variable
  const x = event.clientX
  const y = event.clientY

  gsap.to(scene.rotation, {
    // make the object follow the mouse
    y: gsap.utils.mapRange(0, window.innerWidth, -0.4, 0.4, x),
    x: gsap.utils.mapRange(0, window.innerHeight, -0.4, 0.4, y),
    duration: 0.2
  })
}

// window.addEventListener('mousemove', onMouseMove)