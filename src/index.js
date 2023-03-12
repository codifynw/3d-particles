import * as THREE from 'three'
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Model from './model'

let tick = 0;

/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
  antialias: true,
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
  placeOnLoad: true,
  color1: 'red',
  color2: 'blue',
  background: 'black',
});

const horse = new Model({
  name: 'horse',
  url: './models/horse.glb',
  scene: scene,
  color1: 'black',
  color2: 'red',
  background: 'silver',
});

const models = [skull, horse];

/*------------------------------
Controllers
------------------------------*/
const buttons = document.querySelectorAll('button');

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    models.forEach((model, i) => {
      if (index === i) {
        model.add();
      } else {
        model.remove();
      }
    }
  )})
})

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

window.addEventListener('mousemove', onMouseMove)