const multer = require('multer');

//1: Demande à multer d'enregistrer les fichiers dans le dossier "images"
const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    cb(null, makeFilename(req, file))
  }
})

//2: Avec le nom créé via la fonction suivante:
function makeFilename(req, file) {
  console.log("req, file:", file)
  //convertis les espaces en _ dans le nom de fichier original et construit le nouveau nom : "sans_espaceDate.type"
  const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")
  file.fileName = fileName
  return fileName
}

// Methode single pour ne traiter qu'un fichier de type 'image' à la fois
const upload = multer({ storage }).single('image');

module.exports = { upload };



