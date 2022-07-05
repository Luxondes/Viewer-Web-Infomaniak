import { main } from './heightMap.js';

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

function htmlspecialchars(s){
	return (typeof s=='string')?s.replace(/\</g,'&lt;')
								 .replace(/\>/g,'&gt;')
								 .replace(/&lt;/g,'<span>&lt;')
								 .replace(/&gt;/g,'&gt;</span>')
								.replace(/(\n)/gm,'<br>')
                //  .replace(/&lt;/gm,'<br>&lt;')
                //  .replace(/&gt;/gm,'&gt;<br>')
								 :'';
}

function handleFiles(files) {
    const formData = new FormData(); // création formData
    files = [...files];
    files.forEach(file => formData.append("files", file)); // ajout des fichiers au formData
    // envoi du formData coté serveur pour décompression des fichiers
    fetch("./upload_files", {
      method:'POST',
      body: formData
    })
      .then((res) =>
      {
        return res.json(); // réponse format json
      })
      .then(json =>
      {
        loadFiles(json.files); // chargement fichiers
      })
      .catch((err) => ("Submit Error", err)); // retour d'erreur
  }
  
  function loadFiles(urls)
  {

    const container = document.getElementById('container');
    // récupére puis traite les url en fonction des types de fichiers
    urls.forEach(url =>
    { 
      switch(url.split('.').at(-1))
      {
  
        case 'jpg': // si image, modifie l'image du menu et du plan
            let img = document.getElementById('img');
            img.src = url;
            break;

        case 'xml':
            let data = JSON.stringify({
                "urls": url
            });
            // envoie de l'url de l'xml pour lecture du fichier coté serveur
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
                return res.json(); // réponse format json
            })
            .then(json =>
            {
                let xmlTexte = json.texte;
                // Parse puis recupere valeurs balises utiles
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(xmlTexte,"text/xml");
                if (xmlDoc.getElementsByTagName("Path")[0].childNodes[0].nodeValue){
                    // balises de taille de l'image
                    document.getElementById("Xsize").innerHTML = xmlDoc.getElementsByTagName("Xsize")[0].childNodes[0].nodeValue;
                    document.getElementById("Ysize").innerHTML = xmlDoc.getElementsByTagName("Ysize")[0].childNodes[0].nodeValue;
                }
                document.body.removeChild(document.getElementById ("canvas"));

                while (document.getElementById("container").firstElementChild){
                  document.getElementById("container").removeChild(list.firstElementChild);                  
                }

                let element = document.createElement('div');
                let text = document.createElement('code');
                text.setAttribute("id","xmlText");
                text.innerHTML =  htmlspecialchars(xmlTexte);
                element.appendChild(text);
                container.appendChild(element);
            })
            .catch((err) => ("Submit Error", err)); // retour d'erreur
                break;
          
        case 'dat':
            let datad = JSON.stringify({
                "urls": url
              });
              fetch("./upload_dat", {
                method:'POST',
                body: datad,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              })
                .then((res) =>
                {
                  return res.json(); // réponse format json
                })
                .then(json =>
                {
                  let datTexte = json.texte;
                  document.getElementById("dat").innerHTML = datTexte;
                  main();
                })
                .catch((err) => ("Submit Error", err)); // retour d'erreur
              break;
  
        default:
          break;
      }
    });
  }
  
  async function deleteSignal(){
    console.log('del');
    fetch("./delete_signal", { // envoi du signal coté serveur pour supprimer fichiers uploadés
      method:'POST',
      body: "delete_signal"
    })
      .catch((err) => ("Submit Error", err)); // retour d'erreur
  }
  
  window.onbeforeunload = deleteSignal; // delete avant chaque fermeture page (ou F5)
