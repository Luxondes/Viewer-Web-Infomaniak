import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';
import { makePlot } from './plot.js';

export function main(){

  let canvasG = document.getElementById("heightgrd");
  let colorTexture = new THREE.CanvasTexture(canvasG);
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
    colorTexture.needsUpdate = true;
  }

  canvasG.addEventListener("click", ()=>{
    updateGradMap();
  }, false);

  function updateGradMap() {
    mires_index = (mires_index + 1) % 7;
    ctxG.clearRect(0, 0, 64, 256);
    ctxG.drawImage(mires[mires_index], 0, 0, 64, 256);
    colorTexture.needsUpdate = true;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  const section = document.getElementById("section")
  camera.position.set(0, 40, 60);
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth-78, window.innerHeight);
  renderer.domElement.id = "canvas";
  renderer.setClearColor(0xE4E9F7);
  section.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI/2+0.02;

  const gC = 0x660066;
  let grid = new THREE.GridHelper(50, 25, gC, gC);


  const image = document.getElementById("img");
  let imageSrc = image.src;
  grid.position.y = -3;
  scene.add( grid );

  const xsize = document.getElementById("Xsize");
  let xsizehtml = xsize.innerHTML;

  const ysize = document.getElementById("Ysize");
  let ysizehtml = ysize.innerHTML;

  let geometry = new THREE.PlaneGeometry( 50, ysizehtml/xsizehtml*50 );
  let texture = new THREE.TextureLoader().load( imageSrc );
  let material = new THREE.MeshBasicMaterial( { map: texture , side: THREE.DoubleSide} );
  let plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -2;
  scene.add( plane );

  window.addEventListener( 'resize', onWindowResize, false );



  let uniforms = {
    colorTexture: {value: colorTexture}
  }



  let meshBasic = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    onBeforeCompile: shader => {
      shader.uniforms.colorTexture = uniforms.colorTexture;
      shader.vertexShader = `
        varying vec3 vPos;
        ${shader.vertexShader}
      `.replace(
        `#include <fog_vertex>`,
        `#include <fog_vertex>
        vPos = vec3(position);
        `
      );
      shader.fragmentShader = `
      uniform float limits;
      uniform sampler2D colorTexture;

        varying vec3 vPos;
        ${shader.fragmentShader}
      `.replace(
        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        `
        float h = vPos.y;
        vec4 diffuseColor = texture2D(colorTexture, vec2(0, h));
        `
        );
      }
    })



    const datstr = document.getElementById("dat");
    let dathtml = datstr.innerHTML;

    if (dathtml) {
        let lines = dathtml.trim().split('\n')

        for (let i = 0; i < lines.length; i++) {
          lines[i] = lines[i].split('\t');
          for (let j = 0; j < lines[i].length; j++) {
            lines[i][j] = parseFloat(lines[i][j]);
          }
        }

        let dataMmin = lines[0][3];
        let dataMmax = lines[0][3];
        let dataXmax = lines[0][0];
        let dataXmin = lines[0][0];
        let dataYmax = lines[0][1];
        let dataYmin = lines[0][1];
        let x=lines[0][0];
        let y=lines[0][1];
        let z=lines[0][2];
        let dif=0;
        let step=Number.MAX_SAFE_INTEGER;
        // console.log("step : " + step);

        for (let index = 0; index < lines.length; index++) {
          for (let indexColumn = 3; indexColumn < lines[0].length; indexColumn++) {
            dataMmin = Math.min(lines[index][indexColumn],dataMmin);
            dataMmax = Math.max(lines[index][indexColumn],dataMmax);
          }

          dif = Math.abs(x - lines[index][0]);
          if (dif > 0) {
            step = Math.min(step, dif);
          }
          dif = Math.abs(y - lines[index][1]);
          if (dif > 0) {
            step = Math.min(step, dif);
          }
          dif = Math.abs(z - lines[index][2]);
          if (dif > 0) {
            step = Math.min(step, dif);
          }
          x = lines[index][0];
          y = lines[index][1];
          z = lines[index][2];

          dataXmin = Math.min(lines[index][0],dataXmin);
          dataYmin = Math.min(lines[index][1],dataYmin);
          dataXmax = Math.max(lines[index][0],dataXmax);
          dataYmax = Math.max(lines[index][1],dataYmax);
        }
        let numberX=Math.floor((Math.abs(dataXmax - dataXmin) / step) + 1);
        let numberY=Math.floor((Math.abs(dataYmax - dataYmin) / step) + 1);
        step=Math.round(step);

        console.log(numberX, numberY);


        let planeHeightmap = new THREE.PlaneBufferGeometry(numberX, numberY, numberX-1, numberY-1);
        // console.log("numberX : " + numberX);
        // console.log("numberY : " + numberY);
        // console.log("step : " + step);
        planeHeightmap.rotateX(-Math.PI * 0.5);
        let o = new THREE.Mesh(planeHeightmap, meshBasic);
        scene.add(o);
        let pos = planeHeightmap.attributes.position;
        let uv = planeHeightmap.attributes.uv;
        // console.log("lines : " + lines.length);
        // console.log("planeHeightmap.attributes.position : " + pos.count);
        let indexPos=0;
        let index=0;
        for ( x = 0; x < numberX; x++) {
          for (y = 0; y < numberY; y++) {
            indexPos=x+y*numberX;
            pos.setY(indexPos,(lines[index][3]-dataMmin)/(dataMmax-dataMmin));
            index = index + 1 ;
          }
        }
        pos.needsUpdate = true;

        makePlot(lines, 0, numberX, numberY);

    }
    else{

    }
  if (document.getElementById ("stat")) {
    document.body.removeChild(document.getElementById ("stat"));
  }
  const stats = new Stats();
  stats.showPanel( 0 );
  stats.domElement.style.cssText = 'position:absolute;bottom:0px;right:160px;';
  stats.domElement.id = "stat";
  section.appendChild( stats.dom );

  if (document.getElementById ("stat2")) {
    document.body.removeChild(document.getElementById ("stat2"));
  }
  const stats2 = new Stats();
  stats2.showPanel( 1 );
  stats2.domElement.style.cssText = 'position:absolute;bottom:0px;right:80px;';
  stats2.domElement.id = "stat2";
  section.appendChild( stats2.dom );

  if (document.getElementById ("stat3")) {
    document.body.removeChild(document.getElementById ("stat3"));
  }
  const stats3 = new Stats();
  stats3.showPanel( 2 );
  stats3.domElement.style.cssText = 'position:absolute;bottom:0px;right:0px;';
  stats3.domElement.id = "stat3";
  section.appendChild( stats3.dom );


  renderer.setAnimationLoop(()=>{
    renderer.render(scene, camera);
    stats.update()
    stats2.update()
    stats3.update()
  })


  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
}
main();
