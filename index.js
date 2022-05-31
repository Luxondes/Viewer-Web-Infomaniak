const express = require('express');
const multer = require('multer');
const decompress = require("decompress");
const fs = require('fs');

const app = express();

// configuration de l'espace de travail de multer
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// projet frontend à lancer
app.use(express.static('public'));

app.post("/upload_xml", readFile);
app.post("/upload_dat", readFile);

function readFile(req, res)
{
  try {
    let data = fs.readFileSync('./public/' + req.body.urls, 'utf8');
    res.json({success:true, texte:data});
  } catch (err) {
    console.error(err);
  }
}

// On traite les requetes POST vers l'URL upload_files,
app.post("/upload_files",
  upload.array("files"), // copie des fichiers par multer dans son répertoire de travail
  uploadFiles);

  function uploadFiles(req, res)
  {
    // fonction de décompression
    unzipRec(req.files, res);
  }
  
  function unzipRec(files, res, rep=[])
  {
    if(0 == files.length)
      // envoie de la liste d'url en front
      res.json({success:true, files:rep});
    else
    {
      let file = files.shift();
      // dézippage
      decompress(file.path, "public/files").then(unzippedFiles =>
      {
        unzippedFiles.forEach(unzippedFile =>
        {
          rep.push('files/'+unzippedFile.path); // ajout des url à la liste d'url
        });
        unzipRec(files, res, rep); // appel récursif
      });
    }
  }

//supprime fichiers lorsque l'on quitte ou refresh la page
app.post("/delete_signal", () => {
  // supression ./public/files
  if (fs.existsSync('./public/files')) fs.rm('./public/files', { recursive: true, force: true }, (err) => {
    if (err) throw err });

  // supression ./uploads
  if (fs.existsSync('./uploads')) {
    fs.rmSync('./uploads', { recursive: true, force: true }); // supprime dossier
    fs.mkdir('./uploads', (error) => { // puis on le recrée vide pour le bon fonctionnement de multer
      if (error) console.log(error);
    });
  }
});


app.listen(3000, () => console.log("server listening on port 3000"));