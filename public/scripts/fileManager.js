import { main } from './heightMap.js';

let dropArea = document.getElementById("drop-area");
let fileElem = document.getElementById ("fileElemAdd");
let fileElem2 = document.getElementById ("fileElemAdd2");
const section = document.getElementById("section")


// ajout des evenements apres avoir ajouté ou zip (drag&drop ou gestionnaire fichier)
dropArea.addEventListener('drop', handleDrop, false);
fileElem.addEventListener('change', handleDl1, false);
fileElem2.addEventListener('change', handleDl2, false);

// récupération files gestionnaire fichier
function handleDl1(){
  let files = this.files;
  handleFiles(files, 1);
}
function handleDl2(){
  let files = this.files;
  handleFiles(files, 2);
}

// récupération files drag&drop
function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;

  handleFiles(files, 1);
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

function handleFiles(files, dataNb) {
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
        loadFiles(json.files, dataNb); // chargement fichiers        
      })
      .catch((err) => ("Submit Error", err)); // retour d'erreur
  }
  
  function loadFiles(urls, dataNb)
  {

    // récupére puis traite les url en fonction des types de fichiers
    urls.forEach(url =>
    { 
      switch(url.split('.').at(-1))
      {
  
        case 'jpg': // si image, modifie l'image du menu et du plan
            let gallery = document.getElementById("gallery"+dataNb);
            if (gallery.firstElementChild){
              gallery.removeChild(gallery.firstElementChild);                  
            }

            let element = document.createElement('img');
            element.setAttribute("id","img"+dataNb);
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
                    document.getElementById("Xsize"+dataNb).innerHTML = xmlDoc.getElementsByTagName("Xsize")[0].childNodes[0].nodeValue;
                    document.getElementById("Ysize"+dataNb).innerHTML = xmlDoc.getElementsByTagName("Ysize")[0].childNodes[0].nodeValue;
                }
                let a0 = xmlDoc.getElementsByTagName("A0")[0];
                let b0 = xmlDoc.getElementsByTagName("B0")[0];
                let r0 = xmlDoc.getElementsByTagName("R0")[0];
                if (a0 && b0 && r0) { 
                  document.getElementById("abr"+dataNb).innerHTML = 1;
                }else{
                  document.getElementById("abr"+dataNb).innerHTML = 0;
                }

                let container = document.getElementById("container"+dataNb);
                if (container.firstElementChild){
                  container.removeChild(container.firstElementChild);                  
                }

                let text = document.createElement('code');
                text.setAttribute("id","xmlText");
                text.innerHTML =  htmlspecialchars(xmlTexte);
                container.appendChild(text);
                section.removeChild(document.getElementById ("canvas"));
                main();
                
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
                  document.getElementById("dat"+dataNb).innerHTML = datTexte;
                  section.removeChild(document.getElementById ("canvas"));
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
    fetch("./delete_signal", { // envoi du signal coté serveur pour supprimer fichiers uploadés
      method:'POST',
      body: "delete_signal"
    })
      .catch((err) => ("Submit Error", err)); // retour d'erreur
  }
  
  window.onbeforeunload = deleteSignal; // delete avant chaque fermeture page (ou F5)
