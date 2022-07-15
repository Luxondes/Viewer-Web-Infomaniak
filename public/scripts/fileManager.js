import { main } from './heightMap.js';

let dropArea = document.getElementById("drop-area");
let fileElem = document.getElementById ("fileElemAdd");
let canvas = document.getElementById ("canvas");
const section = document.getElementById("section")
let hiddenDrop = true;



// preventDefault les événements liés au drag & drop
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  canvas.addEventListener(eventName, preventDefaults, false);  
  dropArea.addEventListener(eventName, preventDefaults, false);   
  document.body.addEventListener(eventName, preventDefaults, false);
})

canvas.addEventListener('dragenter', unhide);
dropArea.addEventListener('dragenter', unhide);

dropArea.addEventListener('dragleave', hide);
dropArea.addEventListener('drop', hide);


// ajout des evenements apres avoir ajouté ou zip (drag&drop ou gestionnaire fichier)
dropArea.addEventListener('drop', handleDrop, false);
fileElem.addEventListener('change', handleDl, false);

// fonctions affichage ou non
function unhide(){
    dropArea.classList.remove('hidden');
    hiddenDrop = false;
}
function hide(){
    dropArea.classList.add('hidden');
    hiddenDrop = true;
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
        section.removeChild(document.getElementById ("canvas"));
      })
      .catch((err) => ("Submit Error", err)); // retour d'erreur
  }
  
  function loadFiles(urls)
  {

    const files = document.getElementById('files');
    // récupére puis traite les url en fonction des types de fichiers
    urls.forEach(url =>
    { 
      switch(url.split('.').at(-1))
      {
  
        case 'jpg': // si image, modifie l'image du menu et du plan
        
            let gallery = document.getElementById("gallery");
            if (gallery.firstElementChild){
              gallery.removeChild(gallery.firstElementChild);                  
            }

            let element = document.createElement('img');
            element.setAttribute("id","img1");
            element.setAttribute("src",url);
            gallery.appendChild(element);
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
                

                while (document.getElementById("container").firstElementChild){
                  document.getElementById("container").removeChild(list.firstElementChild);                  
                }

                let element = document.createElement('div');
                let text = document.createElement('code');
                text.setAttribute("id","xmlText");
                text.innerHTML =  htmlspecialchars(xmlTexte);
                element.appendChild(text);
                files.appendChild(element);
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
