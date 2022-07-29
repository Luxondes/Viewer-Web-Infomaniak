//script de rendu three.js et élements qui tournent autour
import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';
import { makePlot } from './plot.js';
import { dragDrop } from './dragDrop.js';

export function mainRender(){

// script pour gestion des mires de couleur

  // crée canvas data 1
  let canvas_data_1 = document.getElementById("heightgrd_1");
  let color_texture_1 = new THREE.CanvasTexture(canvas_data_1);
  let contexte_1 = canvas_data_1.getContext("2d");

  // crée canvas data 2
  let canvas_data_2 = document.getElementById("heightgrd_2");
  let color_texture_2 = new THREE.CanvasTexture(canvas_data_2);
  let contexte_2 = canvas_data_2.getContext("2d");

  // on crée la liste de toute les mires
  let liste_mires = [];
  for (let i = 1; i < 8; i++) {
    let img = new Image();
    img.src = "../img/mir_0" + i + ".jpg";
    liste_mires.push(img)
  }
  let mires_index, mires_index2;

  // instancie mires avec valeur par defaut au chargement page dans les options, qui seront cachés jusque upload d'un fichier
  window.addEventListener("load", ()=>{
    createMires();
  }, false);

  createMires();
  function createMires() {
    mires_index = 0;
    contexte_1.drawImage(liste_mires[mires_index], 0, 0, 64, 256);
    color_texture_1.needsUpdate = true;

    mires_index2 = 0;
    contexte_2.drawImage(liste_mires[mires_index2], 0, 0, 64, 256);
    color_texture_2.needsUpdate = true;
  }

  // changement de mire au clique sur celles-ci pour la mire 1
  canvas_data_1.addEventListener("click", ()=>{
    updateMires1();
  }, false);

  // on incrémente l'indice de la mire 1 modulo le nombre de mires
  function updateMires1() {
    mires_index = (mires_index + 1) % 7;
    contexte_1.clearRect(0, 0, 64, 256);
    contexte_1.drawImage(liste_mires[mires_index], 0, 0, 64, 256);
    color_texture_1.needsUpdate = true;
  }

  // changement de mire au clique sur celles-ci pour la mire 2
  canvas_data_2.addEventListener("click", ()=>{
    updateMires2();
  }, false);

  // on incrémente l'indice de la mire 2 modulo le nombre de mires
  function updateMires2() {
    mires_index2 = (mires_index2 + 1) % 7;
    contexte_2.clearRect(0, 0, 64, 256);
    contexte_2.drawImage(liste_mires[mires_index2], 0, 0, 64, 256);
    color_texture_2.needsUpdate = true;
  }



// script rendu three.js

  // création scène et caméra
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 40, 60);

  // création rendu
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth-78, window.innerHeight);
  renderer.domElement.id = "canvas";
  renderer.setClearColor(0xE4E9F7);

  //ajout du rendu à section
  const section = document.getElementById("section")
  section.appendChild(renderer.domElement);

  // ajout des controles
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI/2+0.02;



// script pour la grille

  // création grille
  let grid = generateGrid();
  scene.add( grid );
  let display_grid = document.getElementById("display_grid");
  // gestion affichage ou non de la grille
  display_grid.addEventListener("change", () => {
    grid.visible = !grid.visible;
  })

  //fonction création grille
  function generateGrid(){
    const gridColor = 0x660066;
    let grid = new THREE.GridHelper(50, 25, gridColor, gridColor);
    grid.position.y = -3;
    return grid;
  }



// script pour les images des data 1 et 2
  const image_1 = document.getElementById("img1");
  const image_2 = document.getElementById("img2");

  let image_data_1, image_data_2;
  if (image_1){
    // création image data 1
    image_data_1 = generateImage(image_1, size_X_1, size_Y_1);
    scene.add( image_data_1 );
    // gestion affichage ou non de l'image data 1
    let displayImg1 = document.getElementById("display_image_1");
    displayImg1.addEventListener("change", () => {
      image_data_1.visible = !image_data_1.visible;
    })
  }
  if (image_2){
    // création image data 2
    image_data_2 = generateImage(image_2, size_X_2, size_Y_2);
    scene.add( image_data_2 );
    // gestion affichage ou non de l'image data 2
    let displayImg2 = document.getElementById("display_image_2");
    displayImg2.addEventListener("change", () => {
      image_data_2.visible = !image_data_2.visible;
    })
  }

  //fonction création images
  function generateImage(image, xsize, ysize){
    let image_src = image.src;
    let geometry = new THREE.PlaneGeometry( 50, ysize/xsize*50 );
    let texture = new THREE.TextureLoader().load( image_src );
    let material = new THREE.MeshBasicMaterial( { map: texture , side: THREE.DoubleSide, opacity: 1, transparent: true} );
    let image_data_1 = new THREE.Mesh( geometry, material );
    image_data_1.rotation.x = -Math.PI / 2;
    image_data_1.position.y = -2;
    return image_data_1;
  }

// script pour la coupe

  // création coupe
  let coupe = generateCoupe();
  scene.add( coupe );
  // gestion affichage ou non de la coupe
  let display_coupe = document.getElementById("display_coupe");
  display_coupe.addEventListener("change", () => {
    coupe.visible = !coupe.visible;
  })

  // fonction création coupe
  function generateCoupe(){
    let geometry = new THREE.PlaneGeometry( 50, 25 );
    let material = new THREE.MeshBasicMaterial({
      color: 0xffba33,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true
    });
    let coupe = new THREE.Mesh( geometry, material );
    coupe.position.x = -23;
    coupe.rotation.y = -Math.PI / 2;
    coupe.visible = false;
    return coupe ;
  }



// script pour la gestion des input range

  // input range de la transparence de l'image data 1
  let range_default_value_image_1 = 100;
  let range_input_image_1 = document.getElementById("range_input_image_1");
  let range_value_image_1 = document.getElementById("range_value_image_1");
  // affectation valeur par defaut 
  range_value_image_1.innerHTML = range_default_value_image_1;
  // modification de la valeur de l'input range et de l'opacité de l'image data 1
  range_input_image_1.addEventListener("input", () => {
    range_value_image_1.innerHTML = range_input_image_1.value;
    image_data_1.material.opacity = range_input_image_1.value/100;
  })

  // input range de la transparence de l'image data 2
  let range_default_value_image_2 = 100;
  let range_input_image_2 = document.getElementById("range_input_image_2");
  let range_value_image_2 = document.getElementById("range_value_image_2");
  // affectation valeur par defaut 
  range_value_image_2.innerHTML = range_default_value_image_2;
  // modification de la valeur de l'input range et de l'opacité de l'image data 2
  range_input_image_2.addEventListener("input", () => {
    range_value_image_2.innerHTML = range_input_image_2.value;
    image_data_2.material.opacity = range_input_image_2.value/100;
  })

  // input range de la transparence du model data 1
  let range_default_value_model_1 = 100;
  let range_input_model_1 = document.getElementById("range_input_model_1");
  let range_value_model_1 = document.getElementById("range_value_model_1");
  // affectation valeur par defaut
  range_value_model_1.innerHTML = range_default_value_model_1;
  // modification de la valeur de l'input range et de l'opacité du model data 1
  range_input_model_1.addEventListener("input", () => {
    range_value_model_1.innerHTML = range_input_model_1.value;
    uniforms_1.transparency.value=range_input_model_1.value/100.0;
  })

  // input range de la transparence du model data 2
  let range_default_value_model_2 = 100;
  let range_input_model_2 = document.getElementById("range_input_model_2");
  let range_value_model_2 = document.getElementById("range_value_model_2");
  // affectation valeur par defaut
  range_value_model_2.innerHTML = range_default_value_model_2;
  // modification de la valeur de l'input range et de l'opacité du model data 2
  range_input_model_2.addEventListener("input", () => {
    range_value_model_2.innerHTML = range_input_model_2.value;
    uniforms_2.transparency.value=range_input_model_2.value/100.0;
  })

  // input range de la position de la coupe
  let range_default_value_coupe = -23;
  let range_input_coupe = document.getElementById("range_input_coupe");
  let range_value_coupe = document.getElementById("range_value_coupe");
  // affectation valeur par defaut
  range_value_coupe.innerHTML = range_default_value_coupe;
  // modification de la valeur de l'input range et du deplacement de la coupe
  range_input_coupe.addEventListener("input", () => {
    range_value_coupe.innerHTML = range_input_coupe.value;
    // si rotation = Pi, alors axe x donc deplacement de la coupe sur axe y
    if (coupe.rotation.y == Math.PI) {
      coupe.position.z = range_input_coupe.value;
    // sinon axe y donc deplacement de la coupe sur axe x
    }else{
      coupe.position.x = range_input_coupe.value;
    }
  })

  // modification de la position et rotation de la coupe en fonction de l'axe
  let axe_coupe = document.getElementById("coupe_X_Y");
  axe_coupe.addEventListener("change", () => {
    // si rotation = Pi, alors axe x donc placement de la coupe sur l'axe x
    if (coupe.rotation.y == Math.PI) {
      coupe.rotation.y = -Math.PI / 2;
      coupe.position.x = -23;
      coupe.position.z = 0;
      // relancement du graphe sur l'axe x
      makePlot(30, "x");
    // sinon axe y donc placement de la coupe sur l'axe y
    }else{
      coupe.rotation.y = Math.PI;
      coupe.position.x = 0;
      coupe.position.z = -23;
      // relancement du graphe sur l'axe y
      makePlot(13, "y");
    }
    // modification de la valeur du range input a chaque changement d'axe
    range_input_coupe.value = -23;
    range_value_coupe.innerHTML = range_default_value_coupe;
  })


// script shader et heighmap
  let uniforms_1 = {
    color_texture: {value: color_texture_1},
    transparency: {value: 1}
  }
  let uniforms_2 = {
    color_texture: {value: color_texture_2},
    transparency: {value: 1}
  }
  
  // fragment et vertex shader
  function shader(uniforms){
    let mesh_basic = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      onBeforeCompile: shader => {
        shader.uniforms.color_texture = uniforms.color_texture;
        shader.uniforms.transparency = uniforms.transparency;
        shader.vertexShader = `

        varying vec3 vPos;
        ${shader.vertexShader}
        `.replace(
          `#include <fog_vertex>`,
          `#include <fog_vertex>
          vPos = vec3(position.x,position.y,position.z);
          `
        );
        shader.fragmentShader = `
        uniform float limits;
        uniform float transparency;
        uniform sampler2D color_texture;
        varying vec3 vPos;
        ${shader.fragmentShader}
        `.replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `
          float h = vPos.y;
          vec4 diffuseColor = texture2D(color_texture, vec2(0, h));
          diffuseColor.a*=transparency;
          `
        );
      }
    })
    return mesh_basic;
  }

  var model_1, model_2;

  // si data 1 est une sphere
  if (is_sphere_1){
    console.log("A0, B0 & R0");
    // sphereGen(...)

    //sinon 2D
  } else if (data_tab_1){
    model_1 = generateMap(data_tab_1, uniforms_1, 1);
    scene.add( model_1 );
  }

  // si data 2 est une sphere
  if (is_sphere_2){
    console.log("A0, B0 & R0");
    // sphereGen(...)
  
    //sinon 2D
  } else if (data_tab_2){
    model_2 = generateMap(data_tab_2, uniforms_2, 2);
    scene.add( model_2 );
  }

  // fonction création map
  function generateMap(lines, uniform, dataNb){

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
    if (dataNb == 1){lines_number_X_1 = numberX; lines_number_Y_1 = numberY;}
    if (dataNb == 2){lines_number_X_2 = numberX; lines_number_Y_2 = numberY;}
    step=Math.round(step);

    let planeHeightmap = new THREE.PlaneBufferGeometry(numberX, numberY, numberX-1, numberY-1);
    planeHeightmap.rotateX(-Math.PI * 0.5);
    let model_1 = new THREE.Mesh(planeHeightmap, shader(uniform));
    let pos = planeHeightmap.attributes.position;
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
    makePlot(30, "x");
    return (model_1);
  }



  let def_extend=0;
  // fonction de l'input range infini de la hauteur des points de la map
  function mouseUpExtend(){
    if(Math.abs(infiny_extend.value-50)<5){
      return;
    }
    def_extend+=infiny_extend.value-50;
    if(def_extend<0){
      def_extend=0;
    }
    extend_value.innerHTML = def_extend;
    infiny_extend.value=50;
    if(model_1!=undefined)
    {
      model_1.scale.set(1,1+5*def_extend/100.0,1);
    }
    if(model_2!=undefined)
    {
      model_2.scale.set(1,1+5*def_extend/100.0,1);
    }
  }
  if(model_1!=undefined || model_2!=undefined){
    let infiny_extend = document.getElementById("infiny_extend");
    let extend_value = document.getElementById("extend_value");
    infiny_extend.addEventListener("mouseup", mouseUpExtend);
    extend_value.innerHTML = def_extend;
  }

  if(model_1!=undefined){
    let displayO = document.getElementById("display_model_1");
    displayO.addEventListener("change", () => {
      model_1.visible = !model_1.visible;
    })
  }
  if(model_2!=undefined){
    let displayO2 = document.getElementById("display_model_2");
    displayO2.addEventListener("change", () => {
      model_2.visible = !model_2.visible;
    })
  }



// sccript pour les stats de la page

  // on évite d'empiler des stats inutile
  if (document.getElementById ("stat1")) {
    document.body.removeChild(document.getElementById ("stat1"));
  }
  // panel stat fps
  const stats = new Stats();
  stats.showPanel( 0 );
  stats.domElement.style.cssText = 'position:absolute;bottom:0px;right:160px;z-index:99;';
  stats.domElement.id = "stat1";
  stats.domElement.classList.add('hidden');
  document.body.appendChild( stats.dom );

  // on évite d'empiler des stats inutile
  if (document.getElementById ("stat2")) {
    document.body.removeChild(document.getElementById ("stat2"));
  }
  // panel stat ms
  const stats2 = new Stats();
  stats2.showPanel( 1 );
  stats2.domElement.style.cssText = 'position:absolute;bottom:0px;right:80px;z-index:99;';
  stats2.domElement.id = "stat2";
  stats2.domElement.classList.add('hidden');
  document.body.appendChild( stats2.dom );

  // on évite d'empiler des stats inutile
  if (document.getElementById ("stat3")) {
    document.body.removeChild(document.getElementById ("stat3"));
  }
  // panel stat mb
  const stats3 = new Stats();
  stats3.showPanel( 2 );
  stats3.domElement.style.cssText = 'position:absolute;bottom:0px;right:0px;z-index:99;';
  stats3.domElement.id = "stat3";
  stats3.domElement.classList.add('hidden');
  document.body.appendChild( stats3.dom );


  
// script loop du rendu et autres
  renderer.setAnimationLoop(()=>{
    renderer.render(scene, camera);     // rendu loop
    stats.update()      //   |
    stats2.update()     // --| stats loop
    stats3.update()     //   |
  })

  // update rendu au changement de taille de la page
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  window.addEventListener( 'resize', onWindowResize, false );

  // a chaque update de rendu, on reupdate le systeme de drag and drop
  dragDrop();
}
mainRender();
