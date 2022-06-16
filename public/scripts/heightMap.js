import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';
// import * as HMC from './heightMapCanvas.js';

export function main(){
  
  let heatVertex = `
    uniform sampler2D heightMap;
    uniform float heightRatio;
    uniform float heightBias;
    varying vec2 vUv;
    varying float hValue;
    void main() {
      vUv = uv;
      vec3 pos = position;
      hValue = texture2D(heightMap, vUv).r;
      pos.y = hValue * heightRatio;
      pos.y += heightBias;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

      gl_PointSize = 30. * (1. / - mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  let heatFragment = `
    uniform sampler2D gradientMap;
    varying float hValue;

    void main() {
      float v = clamp(hValue, 0., 1.);
      vec3 col = texture2D(gradientMap, vec2(0, v)).rgb;
      gl_FragColor = vec4(col, 1.) ;
    }
  `;
  
  let canvasH = document.getElementById("heightmap");
  canvasH.addEventListener("click", () => {
    createHeightMap();
  }, false);
  let heightMap = new THREE.CanvasTexture(canvasH);
  let ctx = canvasH.getContext("2d");
  
  let dataM = [
    [0, 0, 240], [0, 50, 120], [0, 100, 148], [0, 150, 8], [0, 200, 74],
    [50, 0, 9], [50, 50, 145], [50, 100, 124], [50, 150, 74], [50, 200, 95],
    [100, 0, 56], [100, 50, 115], [100, 100, 74], [100, 150, 234], [100, 200, 7],
    [150, 0, 86], [150, 50, 227], [150, 100, 146], [150, 150, 92], [150, 200, 143],
    [200, 0, 178], [200, 50, 11], [200, 100, 247], [200, 150, 89], [200, 200, 160]
  ]

  createHeightMap();
  function createHeightMap() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 256, 256);
    // for (let i = 0; i < 1; i++) {
    //   let x = Math.floor(Math.random() * 255);
    //   let y = Math.floor(Math.random() * 255);
    //   let radius = 50;
    //   let grd = ctx.createRadialGradient(x, y, 1, x, y, radius);
    //   let h8 = Math.floor(Math.random() * 255);
    //   grd.addColorStop(0, "rgb(" + h8 + "," + h8 + "," + h8 + ")");
    //   grd.addColorStop(1, "transparent");
    //   ctx.fillStyle = grd;
    //   ctx.fillRect(0, 0, 256, 256);
    // }
    for (let index = 0; index < dataM.length; index++) {
      let grd = ctx.createRadialGradient(dataM[index][0]+25, dataM[index][1]+25, 1, dataM[index][0]+25, dataM[index][1]+25, 100);
      let grey = dataM[index][2]
      grd.addColorStop(0, "rgb(" + grey + "," + grey + "," + grey + ")");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 256, 256);
    }
    heightMap.needsUpdate = true;
  }

  let canvasG = document.getElementById("heightgrd");
  let gradientMap = new THREE.CanvasTexture(canvasG);
  let ctxG = canvasG.getContext("2d");

  let mires = []; 
  for (let i = 1; i < 8; i++) {
    let img = new Image();
    img.src = "../img/mir_0" + i + ".jpg";
    mires.push(img)
  }
  let mires_index;

  window.addEventListener("load", ()=>{
    createGradMap();
  }, false);
  
  createGradMap();
  function createGradMap() {
    mires_index = 0;
    ctxG.drawImage(mires[mires_index], 0, 0, 64, 256);
    gradientMap.needsUpdate = true;
  }
  
  canvasG.addEventListener("click", ()=>{
    updateGradMap();
  }, false);
  
  function updateGradMap() {
    mires_index = (mires_index + 1) % 7;
    ctxG.clearRect(0, 0, 64, 256);
    ctxG.drawImage(mires[mires_index], 0, 0, 64, 256);
    ctx.fillStyle = "rgba(255,255,255,0)";
    ctx.fillRect(0, 0, 200, 256);
    gradientMap.needsUpdate = true;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 40, 60);
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.id = "canvas";
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI/2-0.01;

  const gC = 0x660066;
  scene.add(new THREE.GridHelper(50, 25, gC, gC));

  const image = document.getElementById("img");
  let imageSrc = image.src;

  const xsize = document.getElementById("Xsize");
  let xsizehtml = xsize.innerHTML;

  const ysize = document.getElementById("Ysize");
  let ysizehtml = ysize.innerHTML;
  
  let geometry = new THREE.PlaneGeometry( 50, ysizehtml/xsizehtml*50 );
  let texture = new THREE.TextureLoader().load( imageSrc );
  let material = new THREE.MeshBasicMaterial( { map: texture , side: THREE.DoubleSide} );
  let plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 1;
  scene.add( plane );

  const data = {
    width: 50,
    height: 50,
    widthSegments: 500,
    heightSegments: 500,
  };

  let planeGeometry = new THREE.PlaneBufferGeometry(data.width, data.height, data.widthSegments, data.heightSegments);
  planeGeometry.rotateX(-Math.PI * 0.5);

  let heat = new THREE.Points(planeGeometry, new THREE.ShaderMaterial({
    uniforms: {
      heightMap: {value: heightMap},
      heightRatio: {value: 10},
      heightBias: {value: 7},
      gradientMap: {value: gradientMap}
    },
    vertexShader: heatVertex,
    fragmentShader: heatFragment,
  }));

  scene.add(heat);

    var gui = new dat.GUI();
    gui.add(heat.material.uniforms.heightRatio, "value", 0, 25).name("heightRatio");
    gui.add(heat.material.uniforms.heightBias, "value", 1, 10).name("heightBias");

  window.addEventListener( 'resize', onWindowResize, false );

  if (document.getElementById ("stat")) {
    document.body.removeChild(document.getElementById ("stat"));
  }
  const stats = new Stats();
  stats.showPanel( 0 );
  stats.domElement.style.cssText = 'position:absolute;bottom:0px;right:160px;';
  stats.domElement.id = "stat";
  document.body.appendChild( stats.dom );

  if (document.getElementById ("stat2")) {
    document.body.removeChild(document.getElementById ("stat2"));
  }
  const stats2 = new Stats();
  stats2.showPanel( 1 );
  stats2.domElement.style.cssText = 'position:absolute;bottom:0px;right:80px;';
  stats2.domElement.id = "stat2";
  document.body.appendChild( stats2.dom );

  if (document.getElementById ("stat3")) {
    document.body.removeChild(document.getElementById ("stat3"));
  }
  const stats3 = new Stats();
  stats3.showPanel( 2 );
  stats3.domElement.style.cssText = 'position:absolute;bottom:0px;right:0px;';
  stats3.domElement.id = "stat3";
  document.body.appendChild( stats3.dom );


  render();
  function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    stats.update()
    stats2.update()
    stats3.update()
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

  }
}
main();