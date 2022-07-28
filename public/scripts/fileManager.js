import { main } from './heightMap.js';
import { makePlot } from './plot.js';

let dropArea = document.getElementById("drop-area");
let fileElem = document.getElementById ("fileElemAdd");
let fileElem2 = document.getElementById ("fileElemAdd2");
const section = document.getElementById("section")

let dataDropNb = 0;

// ajout des evenements apres avoir ajouté ou zip (drag&drop ou gestionnaire fichier)
dropArea.addEventListener('drop', handleDrop, false);
fileElem.addEventListener('change', handleDl1, false);
fileElem2.addEventListener('change', handleDl2, false);

// récupération files gestionnaire fichier
function handleDl1(){
  let files = this.files;
  dataDropNb = 1;
  handleFiles(files, 1);
}
function handleDl2(){
  let files = this.files;
  dataDropNb = 0;
  handleFiles(files, 2);
}

// récupération files drag&drop
function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;
  dataDropNb = (dataDropNb +1) % 2;

  handleFiles(files, 2-dataDropNb);
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
                return res.json(); // réponse format json
            })
            .then(json =>
            {   
                let xmlTexte = json.texte;
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(xmlTexte,"text/xml");

                let a0=getStringValue(xmlDoc,"Data","A0");
                let b0 = getStringValue(xmlDoc,"Data","B0");
                let r0 =getStringValue(xmlDoc,"Data","R0");
                if (a0 && b0 && r0) {
                  if (dataNb == 1){sphere1 = 1;}
                  if (dataNb == 2){sphere2 = 1;}
                }else{
                  if (dataNb == 1){sphere1 = 0;}
                  if (dataNb == 2){sphere2 = 0;}
                }

                let container = document.getElementById("container"+dataNb);
                if (container.firstElementChild){container.removeChild(container.firstElementChild);}
                let text = document.createElement('code');
                text.setAttribute("id","xmlText");
                text.innerHTML =  htmlspecialchars(xmlTexte);
                container.appendChild(text);

                let image=getStringValue(xmlDoc,"Component","Image","Path");
                // console.log(" "+ image);
                if (image) {
                  let gallery = document.getElementById("gallery"+dataNb);
                  if (gallery.firstElementChild){gallery.removeChild(gallery.firstElementChild);}
                  let element = document.createElement('img');
                  element.setAttribute("id","img"+dataNb);
                  element.setAttribute("src","../files/"+image);
                  gallery.appendChild(element);
                  let x = parseInt(getStringValue(xmlDoc,"Component","Image","Xsize"));
                  let y = parseInt(getStringValue(xmlDoc,"Component","Image","Ysize"));
                  if (dataNb == 1){sizeX1 = x; sizeY1 = y;}
                  if (dataNb == 2){sizeX2 = x; sizeY2 = y;}
                }

                let dat=getStringValue(xmlDoc,"Data","Measurement","Data_files");
                // console.log(" "+ dat);
                if (dat){
                  let datad = JSON.stringify({
                    "urls": "files/"+dat
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
                      
                      let lines = datTexte.trim().split('\n');
                      for (let i = 0; i < lines.length; i++) {
                        lines[i] = lines[i].split('\t');
                        for (let j = 0; j < lines[i].length; j++) {
                          lines[i][j] = parseFloat(lines[i][j]);
                        }
                      }
                      if (dataNb == 1){datlines1 = lines}
                      if (dataNb == 2){datlines2 = lines}

                      if (dataNb == 1){isEmpty1 = false}
                      if (dataNb == 2){isEmpty2 = false}

                      document.getElementById("coupeOptions").classList.remove('hidden');
                      document.getElementById("render3Options").classList.remove('hidden');
                      if (dataNb == 1){
                        document.getElementById("render1Options").classList.remove('hidden');
                        document.getElementById("file1").classList.remove('hidden');
                    }
                      if (dataNb == 2){
                        document.getElementById("render2Options").classList.remove('hidden');
                        document.getElementById("file2").classList.remove('hidden');
                    }


                      section.removeChild(document.getElementById ("canvas"));
                      main();
                    })
                    .catch((err) => ("Submit Error", err)); // retour d'erreur
                }
            })
            .catch((err) => ("Submit Error", err)); // retour d'erreur
            break;

        case 'dat':
            break;

        case 'jpg':
            break;

        default:
            break;
      }
    });
  }
  function getStringValue(){
    if(arguments.length>1){
      let sub_element=arguments[0].getElementsByTagName(arguments[1])[0];
      if(sub_element != null || sub_element != undefined){
        if(arguments.length==2){
          if(sub_element.childNodes.length>0){
            return sub_element.childNodes[0].nodeValue;
          }
          else{
            return null;
          }
        }
        let args = new Array(arguments.length-1);
        args[0]=sub_element;
        let i;
        for (i=1;i<arguments.length-1;i++){
            args[i]=arguments[i+1];
        }
        return getStringValue.apply(this, args);
      }
    }
    return null;
  }

  async function deleteSignal(){
    fetch("./delete_signal", { // envoi du signal coté serveur pour supprimer fichiers uploadés
      method:'POST',
      body: "delete_signal"
    })
      .catch((err) => ("Submit Error", err)); // retour d'erreur
  }

  window.onbeforeunload = deleteSignal; // delete avant chaque fermeture page (ou F5)
