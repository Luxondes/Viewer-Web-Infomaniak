import * as THREE from 'three';

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
    ctxG.drawImage(mires[mires_index], 0, 0, 64, 256);
    gradientMap.needsUpdate = true;
  }

  export {heatFragment, heatVertex, heightMap, gradientMap};