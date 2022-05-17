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
  console.log("FILES SUBMITTED");
  const formData = new FormData();
  files = [...files];
  files.forEach(file => formData.append("files", file));
  console.log(formData);
  // appel de l'URL upload_files
  fetch("./upload_files", {
    method:'POST',
    body: formData
  })
    .then((res) =>
    {
      return res.json();
    })
    .then(json =>
    {
      loadFiles(json.files);
    })        // retour côté client si tout se passe bien
    .catch((err) => ("Submit Error", err)); // retour d'erreur
}

function loadFiles(urls)
{
  const container = document.getElementById('container');
  console.log(container);
  urls.forEach(url =>
  {
    let element = document.createElement('div');
    switch(url.split('.').at(-1))
    {
      case 'jpg':
        let img = document.createElement('img');
        img.src = url;
        element.appendChild(img);
        break;
      case 'txt':
        let anchor = document.createElement('a');
        anchor.href = url;
        anchor.innerHTML = url;
        element.appendChild(anchor);
        break;
      case 'xml':
        let anchorbis = document.createElement('a');
        anchorbis.href = url;
        anchorbis.innerHTML = url;
        element.appendChild(anchorbis);
        break;
      case 'dat':
        let anchorter = document.createElement('a');
        anchorter.href = url;
        anchorter.innerHTML = url;
        element.appendChild(anchorter);
        break;

      default:
        break;
    }
    container.appendChild(element);
  });
}
