import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';

export function main(){

  //création scène
  const scene = new THREE.Scene();
  //scene.background = new THREE.Color( 0xf1f1f1 );
  
  // création caméra
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.z = 1;
  camera.up.set( 0, 0, 1 );
  
  // création du rendu
  const renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.id = "canvas";
  document.body.appendChild(renderer.domElement);
  
  // gestion du controle avec OrbitControl
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI/2-0.01;
  
  // gestion de l'image sur le plan
  const image = document.getElementById("img");
  let imageSrc = image.src;

  const xsize = document.getElementById("Xsize");
  let xsizehtml = 1;
  if (xsize.innerHTML != 0){xsizehtml = xsize.innerHTML;}

  const ysize = document.getElementById("Ysize");
  let ysizehtml = 1;
  if (ysize.innerHTML != 0){ysizehtml = ysize.innerHTML;}

  // ajout des meshs
  let geometry = new THREE.PlaneGeometry( 1, ysizehtml/xsizehtml );
  let texture = new THREE.TextureLoader().load( imageSrc );
  let material = new THREE.MeshBasicMaterial( { map: texture , side: THREE.DoubleSide} );
  let plane = new THREE.Mesh( geometry, material );
  scene.add( plane );
  
  // fonction du rendu en boucle
  const loop = function() {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
  }
  loop();
}
main();
