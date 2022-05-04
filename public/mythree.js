import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

export function main(){

  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.z = 1;
  camera.up.set( 0, 0, 1 );
  
  const renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.id = "canvas";
  document.body.appendChild(renderer.domElement);
  
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI/2-0.01;
  
  const image = document.getElementById ("img");
  let imageSrc = image.src;
  const img = 'https://lh6.ggpht.com/HlgucZ0ylJAfZgusynnUwxNIgIp5htNhShF559x3dRXiuy_UdP3UQVLYW6c=s1200';
  const img2 = 'data:image/webp;base64,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'
  
  let geometry = new THREE.PlaneGeometry( 1, 1 );
  let texture = new THREE.TextureLoader().load( imageSrc );
  let material = new THREE.MeshBasicMaterial( { map: texture , side: THREE.DoubleSide} );
  let plane = new THREE.Mesh( geometry, material );
  scene.add( plane );
  

  const loop = function() {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
  }
  loop();
}
main();
