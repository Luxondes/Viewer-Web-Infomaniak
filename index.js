const express = require('express');
const multer = require('multer');
const decompress = require("decompress");
const app = express();

// configuration de l'espace de travail de multer
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// projet frontend à lancer
app.use(express.static('public'));

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

app.listen(3000, () => console.log("server listening on port 3000"));