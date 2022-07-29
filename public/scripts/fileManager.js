//script de la gestion des fichiers
import { mainRender } from './heightMap.js';

let drop_area = document.getElementById("drop-area");
let add_file_1 = document.getElementById ("add_file_1");
let add_file_2 = document.getElementById ("add_file_2");
const section = document.getElementById("section")

let drop_data_number = 0;     // variable de l'emplacement de drop des data

// ajout des événements apres avoir déposé un fichier en drag and drop ou avec un bouton
drop_area.addEventListener('drop', handleDrop, false);
add_file_1.addEventListener('change', handleDl1, false);
add_file_2.addEventListener('change', handleDl2, false);

// fonction de récupération fichiers gestionnaire fichier bouton data 1
function handleDl1(){
  let files = this.files;
  drop_data_number = 1;
  handleFiles(files, 1);
}
// fonction de récupération fichiers gestionnaire fichier bouton data 2
function handleDl2(){
  let files = this.files;
  drop_data_number = 0;
  handleFiles(files, 2);
}

// fonction de récupération fichiers drag and drop
function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;
  // modification emplacement prochain fichier drop (data 1 ou data2)
  drop_data_number = (drop_data_number +1) % 2;

  handleFiles(files, 2-drop_data_number);
}



// fonction pour transformer les xml du format str à un ensemble de balisages lisible par html
function htmlSpecialChars(s){
	return (typeof s=='string')?s.replace(/\</g,'&lt;')
								 .replace(/\>/g,'&gt;')
								 .replace(/&lt;/g,'<span>&lt;')
								 .replace(/&gt;/g,'&gt;</span>')
								.replace(/(\n)/gm,'<br>')
                //  .replace(/&lt;/gm,'<br>&lt;')
                //  .replace(/&gt;/gm,'&gt;<br>')
								 :'';
}



// fonction de traitement des fichiers
function handleFiles(files, data_number) {
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
        loadFiles(json.files, data_number); // chargement fichiers
      })
      .catch((err) => ("Submit Error", err)); // retour d'erreur
  }

  function loadFiles(urls, data_number)
  {
    // récupére puis traite les url en fonction des types de fichiers
    urls.forEach(url =>
    {
      switch(url.split('.').at(-1))
      {
        case 'xml':     // cas d'un fichier xml

            // envoi du fichier xml pour lecture coté serveur
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
                // traitement réponse au format str
                let xml_texte = json.texte;
                let parser = new DOMParser();
                // traitement texte pour interprétation des balises
                let xml_doc = parser.parseFromString(xml_texte,"text/xml");

                // on regarde si les balises A0, B0 et R0 existent pour savoir si le fichier est une sphere
                let A0=getStringValue(xml_doc,"Data","A0");
                let B0 = getStringValue(xml_doc,"Data","B0");
                let R0 =getStringValue(xml_doc,"Data","R0");

                // si fichier est une Sphere, on modifie les varibales globales l'informant
                if (A0 && B0 && R0) {
                  if (data_number == 1){is_sphere_1 = true;}      // __| on modifie les valeurs en fonction
                  if (data_number == 2){is_sphere_2 = true;}      //   | de l'emplacement des data
                // sinon, on modifie les variables à l'inverse
                }else{
                  if (data_number == 1){is_sphere_1 = false;}      // __| on modifie les valeurs en fonction
                  if (data_number == 2){is_sphere_2 = false;}      //   | de l'emplacement des data
                }

                // on modifie le contenu du sous-menu file avec le contenu de l'xml
                let container = document.getElementById("container_"+data_number);
                if (container.firstElementChild){container.removeChild(container.firstElementChild);}
                let text = document.createElement('code');
                text.setAttribute("id","xmlText");
                // on utilise la fonction de formatage plus haut
                text.innerHTML =  htmlSpecialChars(xml_texte);
                container.appendChild(text);

                // on va chercher l'image correpsondante et on modifie l'image du sous-menu data
                let image=getStringValue(xml_doc,"Component","Image","Path");
                if (image) {
                  let gallery = document.getElementById("gallery_"+data_number);
                  if (gallery.firstElementChild){gallery.removeChild(gallery.firstElementChild);}
                  let element = document.createElement('img');
                  element.setAttribute("id","img"+data_number);
                  element.setAttribute("src","../files/"+image);
                  gallery.appendChild(element);
                  // on modifie ensuite les variables globales des dimensions de l'image
                  let x = parseInt(getStringValue(xml_doc,"Component","Image","Xsize"));
                  let y = parseInt(getStringValue(xml_doc,"Component","Image","Ysize"));
                  if (data_number == 1){size_X_1 = x; size_Y_1 = y;}      // __| on modifie les valeurs en fonction
                  if (data_number == 2){size_X_2 = x; size_Y_2 = y;}      //   | de l'emplacement des data
                }

                // on va chercher l'url du fichier dat
                let dat=getStringValue(xml_doc,"Data","Measurement","Data_files");
                if (dat){
                  // envoi du fichier dat pour lecture coté serveur
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
                      // traitement réponse au format str
                      let dat_texte = json.texte;
                      
                      // transormation du str dat en matrice
                      let lines = dat_texte.trim().split('\n');
                      for (let i = 0; i < lines.length; i++) {
                        lines[i] = lines[i].split('\t');
                        for (let j = 0; j < lines[i].length; j++) {
                          lines[i][j] = parseFloat(lines[i][j]);
                        }
                      }
                      // modification de la variable globale concernant la matrice en fonction de l'emplacement des data
                      if (data_number == 1){data_tab_1 = lines}
                      if (data_number == 2){data_tab_2 = lines}

                      // modification de la variable globale concernant l'existence de data en fonction de l'emplacement des data
                      if (data_number == 1){is_data_1_empty = false}
                      if (data_number == 2){is_data_2_empty = false}

                      //affichage des menus apres drop d'un fichier

                      // affichage coupe et options
                      document.getElementById("coupe_options").classList.remove('hidden');
                      // affichage de l'input range infini de la hauteur des points de la map
                      document.getElementById("render_options_3").classList.remove('hidden');
                      // si l'emplacement des data = 1, affichage des options du rendu 1
                      if (data_number == 1){
                        document.getElementById("render_options_1").classList.remove('hidden');
                        document.getElementById("file_1").classList.remove('hidden');
                    }
                      // si l'emplacement des data = 2, affichage des options du rendu 2
                      if (data_number == 2){
                        document.getElementById("render_options_2").classList.remove('hidden');
                        document.getElementById("file_2").classList.remove('hidden');
                    }

                      // on supprime le rendu pour le recommencer avec les data modifiées
                      section.removeChild(document.getElementById ("canvas"));
                      mainRender();
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


  // fonction pour chercher balises dans le xml 
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

  // fonction pour supprimer les fichiers uploadés coté serveur
  async function deleteSignal(){
    fetch("./delete_signal", { // envoi du signal coté serveur pour supprimer fichiers uploadés
      method:'POST',
      body: "delete_signal"
    })
      .catch((err) => ("Submit Error", err)); // retour d'erreur
  }

  window.onbeforeunload = deleteSignal; // delete avant chaque fermeture page (ou F5)
