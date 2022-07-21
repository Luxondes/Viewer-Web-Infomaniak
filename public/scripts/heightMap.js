import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';
import { makePlot } from './plot.js';
import { dragDrop } from './dragDrop.js';

export function main(){

  let canvasG = document.getElementById("heightgrd");
  let colorTexture = new THREE.CanvasTexture(canvasG);
  let ctxG = canvasG.getContext("2d");

  let canvasG2 = document.getElementById("heightgrd2");
  let colorTexture2 = new THREE.CanvasTexture(canvasG2);
  let ctxG2 = canvasG2.getContext("2d");

  let mires = [];
  for (let i = 1; i < 8; i++) {
    let img = new Image();
    img.src = "../img/mir_0" + i + ".jpg";
    mires.push(img)
  }
  let mires_index, mires_index2;

  window.addEventListener("load", ()=>{
    createGradMap();
  }, false);

  createGradMap();
  function createGradMap() {
    mires_index = 0;
    ctxG.drawImage(mires[mires_index], 0, 0, 64, 256);
    colorTexture.needsUpdate = true;

    mires_index2 = 0;
    ctxG2.drawImage(mires[mires_index2], 0, 0, 64, 256);
    colorTexture2.needsUpdate = true;
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

  canvasG2.addEventListener("click", ()=>{
    updateGradMap2();
  }, false);

  function updateGradMap2() {
    mires_index2 = (mires_index2 + 1) % 7;
    ctxG2.clearRect(0, 0, 64, 256);
    ctxG2.drawImage(mires[mires_index2], 0, 0, 64, 256);
    colorTexture2.needsUpdate = true;
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


  let grid = generateGrid();
  scene.add( grid );
  let displayGrid = document.getElementById("displayGrid");
  displayGrid.addEventListener("change", () => {
    grid.visible = !grid.visible;
  })

  function generateGrid(){
    const gridColor = 0x660066;
    let grid = new THREE.GridHelper(50, 25, gridColor, gridColor);
    grid.position.y = -3;
    return grid;
  }


  const xsize1 = document.getElementById("Xsize1");
  const xsize2 = document.getElementById("Xsize2");

  const ysize1 = document.getElementById("Ysize1");
  const ysize2 = document.getElementById("Ysize2");

  const image1 = document.getElementById("img1");
  const image2 = document.getElementById("img2");

  let plane, plane2;
  if (image1){
    plane = generateImage(image1, xsize1.innerHTML, ysize1.innerHTML);
    scene.add( plane );

    let displayImg1 = document.getElementById("displayImg1");
    displayImg1.addEventListener("change", () => {
    plane.visible = !plane.visible;
    })
  }
  if (image2){
    plane2 = generateImage(image2, xsize2.innerHTML, ysize2.innerHTML);
    scene.add( plane2 );

    let displayImg2 = document.getElementById("displayImg2");
    displayImg2.addEventListener("change", () => {
    plane2.visible = !plane2.visible;
    })
  }


  function generateImage(image, xsize, ysize){
    let imageSrc = image.src;
    let geometry = new THREE.PlaneGeometry( 50, ysize/xsize*50 );
    let texture = new THREE.TextureLoader().load( imageSrc );
    let material = new THREE.MeshBasicMaterial( { map: texture , side: THREE.DoubleSide} );
    let plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    return plane;
  }



 
  let plan = generateCoupe();
  scene.add( plan );

  let displayCoupe = document.getElementById("displayCoupe");
  displayCoupe.addEventListener("change", () => {
    plan.visible = !plan.visible;
  })
  

  function generateCoupe(){
    let geo = new THREE.PlaneGeometry( 50, 25 );
    let mat = new THREE.MeshBasicMaterial({
      color: 0xffba33,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true
    });
    let plan = new THREE.Mesh( geo, mat );
    plan.position.x = -23;
    plan.rotation.y = -Math.PI / 2;
    plan.visible = false;
    return plan ;
  }

  
  let uniforms = {
    colorTexture: {value: colorTexture}
  }
  let uniforms2 = {
    colorTexture: {value: colorTexture2}
  }

  function shader(uniforms){

    let meshBasic = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
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
      return meshBasic;
  }



    let datstr = document.getElementById("dat1");
    let datstr2 = document.getElementById("dat2");
    let abr1 = document.getElementById("abr1");
    let abr2 = document.getElementById("abr2");

    let o, o2;

    if (abr1.innerHTML == 1){
      console.log("A0, B0 & R0");
      // sphereGen(scene1,lines1)
    } else if (datstr.innerHTML){
      o = generateMap(datstr.innerHTML, uniforms, 1);
      scene.add( o );
  
      let displayO = document.getElementById("displayO");
      displayO.addEventListener("change", () => {
      o.visible = !o.visible;
      })
    }

    if (abr2.innerHTML == 1){
      console.log("A0, B0 & R0");
      // sphereGen(scene2,lines2)
    } else if (datstr2.innerHTML){
      o2 = generateMap(datstr2.innerHTML, uniforms2, 2);
      scene.add( o2 );
  
      let displayO2 = document.getElementById("displayO2");
      displayO2.addEventListener("change", () => {
      o2.visible = !o2.visible;
      })
    }

  function generateMap(dathtml, uniform, dataNb){
        let lines = dathtml.trim().split('\n');
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

        let planeHeightmap = new THREE.PlaneBufferGeometry(numberX, numberY, numberX-1, numberY-1);
        // console.log("numberX : " + numberX);
        // console.log("numberY : " + numberY);
        // console.log("step : " + step);
        planeHeightmap.rotateX(-Math.PI * 0.5);
        let o = new THREE.Mesh(planeHeightmap, shader(uniform));
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
        return (o);
    }


    
  if (document.getElementById ("stat")) {
    document.body.removeChild(document.getElementById ("stat"));
  }
  const stats = new Stats();
  stats.showPanel( 0 );
  stats.domElement.style.cssText = 'position:absolute;bottom:0px;right:160px;z-index:99;';
  stats.domElement.id = "stat";
  document.body.appendChild( stats.dom );

  if (document.getElementById ("stat2")) {
    document.body.removeChild(document.getElementById ("stat2"));
  }
  const stats2 = new Stats();
  stats2.showPanel( 1 );
  stats2.domElement.style.cssText = 'position:absolute;bottom:0px;right:80px;z-index:99;';
  stats2.domElement.id = "stat2";
  document.body.appendChild( stats2.dom );

  if (document.getElementById ("stat3")) {
    document.body.removeChild(document.getElementById ("stat3"));
  }
  const stats3 = new Stats();
  stats3.showPanel( 2 );
  stats3.domElement.style.cssText = 'position:absolute;bottom:0px;right:0px;z-index:99;';
  stats3.domElement.id = "stat3";
  document.body.appendChild( stats3.dom );


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

  window.addEventListener( 'resize', onWindowResize, false );
  dragDrop();
}
main();
