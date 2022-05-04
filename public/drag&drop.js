import { main } from './mythree.js';

let dropArea = document.getElementById("drop-area");
let fileElem = document.getElementById ("fileElem");
let selector = document.getElementById ("selector");
let sousPannel = document.getElementById ("souspannel");
let pannel = document.getElementById ("pannel");
let hiddenSelector = false;
let hiddenDrop = false;


;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);   
  document.body.addEventListener(eventName, preventDefaults, false);
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, hidden);
})

document.body.addEventListener('dragenter', unhidden);
dropArea.addEventListener('dragenter', unhidden);

selector.addEventListener('click', hiddenS);

dropArea.addEventListener('drop', handleDrop, false);
fileElem.addEventListener('change', handleDl, false);


function unhidden(){
    dropArea.classList.remove('hidden');
    hiddenDrop = false;
}

function hidden(){
    dropArea.classList.add('hidden');
    hiddenDrop = true;
}

function hiddenS(){
  if (hiddenSelector){
    sousPannel.classList.remove('hidden');
    pannel.style.border = "1px solid #ccc";
    pannel.style.width = "20%";
    hiddenSelector = false;
  }else{
    sousPannel.classList.add('hidden');
    pannel.style.border = "1px solid rgba(0, 0, 255, 0)";
    pannel.style.width = "auto";
    hiddenSelector = true;
  }
}

function preventDefaults(e){
  e.preventDefault();
  e.stopPropagation();
}


function handleDl(e){
  let files = this.files;
  handleFiles(files);
}

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;

  handleFiles(files);
}

function handleFiles(files) {
  files = [...files];
  files.forEach(uploadFile);
  files.forEach(previewFile);
}

function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function() {
    let img = document.createElement('img');
    img.src = reader.result;
    img.setAttribute('id','img');

    const glr = document.getElementById('gallery');
    if (glr.firstElementChild) glr.removeChild(glr.firstElementChild);
    
    document.getElementById('gallery').appendChild(img);
    console.log(img.src);
  
    document.body.removeChild(document.getElementById ("canvas"));
    main();
  }
}

function uploadFile(file, i) {
    let formData = new FormData();
    formData.append('file', file);
  }
