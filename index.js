const express = require('express');
const multer = require('multer');
const decompress = require("decompress");
const app = express();

// configuration de l'espace de travail de multer
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/test', (req, res) =>
{
  console.log("TEST");
  res.send({rep:"test", success:true});
});

// On traite les requetes POST vers l'URL upload_files,
app.post("/upload_files",
  upload.array("files"), // copie des fichiers par multer dans son répertoire de travail
  uploadFiles);

  function uploadFiles(req, res)
  {
    // Pour chaque fichier chargé on fait appel à la fonction de décompression
    //req.files.forEach(file => unzip(file));
    //res.json({success:true});
    unzipRec(req.files, res);
  }
  
  function unzipRec(files, res, rep=[])
  {
    if(0 == files.length)
      res.json({success:true, files:rep});
    else
    {
      let file = files.shift();
      decompress(file.path, "public/files").then(unzippedFiles =>
      {
        unzippedFiles.forEach(unzippedFile =>
        {
          rep.push('files/'+unzippedFile.path);
        });
        unzipRec(files, res, rep);
      });
    }
  }

app.listen(3000, () => console.log("server listening on port 3000"));