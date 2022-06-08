import * as THREE from 'three';
import * as BufferGeometryUtils from '../lib/BufferGeometryUtils.js';
import { OrbitControls } from '../lib/OrbitControls.js';


export function main(){

  //création scène
  const scene = new THREE.Scene();
  
  // création caméra
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.z = 1;
  camera.up.set( 0, 0, 1 );
  
  // création du rendu
  const renderer = new THREE.WebGLRenderer( { antialias: false } );
  // renderer.setPixelRatio( window.devicePixelRatio * 0.9 );
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
  
  let cubeArray = [];
  for (let index = 0; index < 5000; index++) {
    let cubeGeo = new THREE.BoxBufferGeometry( 0.01, 0.01, 0.01 );
    cubeGeo.translate(Math.random(-1,1), Math.random(-1,1) , Math.random(-1,1));
    cubeArray.push(cubeGeo);
  }
  const cubeGeos = BufferGeometryUtils.mergeBufferGeometries(cubeArray);
  const cubes = new THREE.Mesh(cubeGeos, new THREE.MeshNormalMaterial() );
  cubes.position.set(-0.5, -0.5, 0.1)
  scene.add(cubes);



  const stats = new Stats();
	stats.showPanel( 0 );
  stats.domElement.style.cssText = 'position:absolute;top:0px;right:80px;';
	document.body.appendChild( stats.dom );

  const stats2 = new Stats();
	stats2.showPanel( 1 );
  stats2.domElement.style.cssText = 'position:absolute;top:48px;right:80px;';
	document.body.appendChild( stats2.dom );

  const stats3 = new Stats();
	stats3.showPanel( 2 );
  stats3.domElement.style.cssText = 'position:absolute;top:96px;right:80px;';
	document.body.appendChild( stats3.dom );

  // fonction du rendu en boucle
  const loop = function() {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
    stats.update()
    stats2.update()
    stats3.update()
  }
  loop();
}
main();
