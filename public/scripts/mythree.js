import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';

export function main(){

  //création scène
  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xfcfcfc );
  
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
  let materialplan = new THREE.MeshBasicMaterial( { map: texture , side: THREE.DoubleSide} );
  let plane = new THREE.Mesh( geometry, materialplan );
  scene.add( plane );

  let ballGeo = new THREE.BoxGeometry( 0.01, 0.01, 0.01 );
  let ballMat = new THREE.MeshBasicMaterial( {color: "rgb(125,125,125)"} );
  let ball = new THREE.Mesh(ballGeo, ballMat);
  ball.position.z = 0.5;

  for (let i=-4; i<5; i++) {
    for (let j=-4 ; j<5; j++) {

      let cubeGeo = new THREE.BoxGeometry( 0.01, 0.01, 0.01 );
      ball.updateMatrix();
      cubeGeo.merge(ball.geometry, ball.matrix);

      let cubeMat = new THREE.MeshBasicMaterial( {color: "rgb("+ (i+4)*30 +", "+ (j+4)*30 +", "+ (0+4)*30 +")"} );
      let cube = new THREE.Mesh( cubeGeo, cubeMat );
      cube.position.x = i* 0.1;
      cube.position.y = j* 0.1;
      cube.position.z = 0.15;
      scene.add(cube);

    }    
  }

  // function generateCube(nCubes, generated){
  //   let geometry 	= new THREE.CubeGeometry( 50, 50, 50 );
  //   let material 	= new THREE.MeshNormalMaterial();
  //   let mesh	= new THREE.Mesh( geometry, material );
  
  //   for ( let generated = 0; nCubes > generated; generated++ ) {
  //     mesh.position.x = Math.random() * 300 - 150;
  //     mesh.position.y = Math.random() * 300 - 150;
  //     mesh.position.z = Math.random() * 300 - 150;
  //     mesh.rotation.x = Math.random() * 360 * ( Math.PI / 180 );
  //     mesh.rotation.y = Math.random() * 360 * ( Math.PI / 180 );
  //     THREE.GeometryUtils.merge(mergedGeo, mesh);
  //   }
    
  //   if( nCubes !== generated){
  //     setTimeout(function(){	generateCube(nCubes, generated);	    }, 0)
  //   }
  
  //   if( nCubes === generated ){
  //     mergedGeo.computeFaceNormals();
  //     group	= new THREE.Mesh( mergedGeo, material );
  //     group.updateMatrix();
  //     scene.add( group );					
  //   }
    
  // }

  // let group 		= new THREE.Object3D();					
  // let mergedGeo	= new THREE.Geometry();
  // generateCube(100, 0);

  
  // fonction du rendu en boucle
  const loop = function() {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
  }
  loop();
}
main();
