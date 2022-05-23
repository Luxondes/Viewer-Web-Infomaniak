import { main } from './mythree.js';

let dropArea = document.getElementById("drop-area");
let fileElem = document.getElementById ("fileElem");
let selector = document.getElementById ("selector");
let sousPannel = document.getElementById ("souspannel");
let pannel = document.getElementById ("pannel");
let hiddenSelector = false;
let hiddenDrop = false;

// preventDefault les événements liés au drag & drop
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);   
  document.body.addEventListener(eventName, preventDefaults, false);
})

// gestion affichage zone de drop
;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, hidden);
})

document.body.addEventListener('dragenter', unhidden);
dropArea.addEventListener('dragenter', unhidden);

// gestion affichage menu 
selector.addEventListener('click', hiddenS);

// ajout des evenements apres avoir ajouté ou zip (drag&drop ou gestionnaire fichier)
dropArea.addEventListener('drop', handleDrop, false);
fileElem.addEventListener('change', handleDl, false);

// fonctions affichage ou non
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

// fonction preventDefault
function preventDefaults(e){
  e.preventDefault();
  e.stopPropagation();
}

// récupération files gestionnaire fichier
function handleDl(e){
  let files = this.files;
  handleFiles(files);
}

// récupération files drag&drop
function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;

  handleFiles(files);
}


function handleFiles(files) {
  console.log("FILES SUBMITTED");
  const formData = new FormData(); // création formData
  files = [...files];
  files.forEach(file => formData.append("files", file)); // ajout des fichiers au formData
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
  // récupére puis traite les url en fonction des types de fichiers
  urls.forEach(url =>
  {
    let element = document.createElement('div');
    switch(url.split('.').at(-1))
    {
      case 'jpg': // si image, modifie l'image du menu et du plan
        let img = document.getElementById('img');
        img.src = url;
        const glr = document.getElementById('gallery');

        //retire ancien canvas
        if (glr.firstElementChild) glr.removeChild(glr.firstElementChild);
        document.getElementById('gallery').appendChild(img);
        document.body.removeChild(document.getElementById ("canvas"));
        //nouveau canvas
        main();
        break;
      // sinon création liens fichiers xml et dat
      case 'xml':
        let data = JSON.stringify({
          "urls": url
         });
        fetch("./upload_xml", {
          method:'POST',
          body: data,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
          .then((res) =>
          {
            return res.json();
          })
          .then(json =>
          {
            let texte = json.texte;
            let xmlText = document.createElement('p');
            xmlText.innerHTML = texte;
            element.appendChild(xmlText);
          })        // retour côté client si tout se passe bien
          .catch((err) => ("Submit Error", err)); // retour d'erreur
        let anchorter2 = document.createElement('a');
        anchorter2.href = url;
        anchorter2.innerHTML = url;
        element.appendChild(anchorter2);
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

function deleteSignal(){
  fetch("./delete_signal", { // envoi du signal pour supprimer
    method:'POST',
    body: "delete_signal"
  })
    .catch((err) => ("Submit Error", err)); // retour d'erreur
}

window.onbeforeunload = deleteSignal;
