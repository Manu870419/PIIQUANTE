const Sauce = require("../models/sauces");
const mongoose = require('mongoose');
const { unlink } = require("fs/promises");


function getAllSauces(req, res) {
   Sauce.find({})
      .then(sauces => { res.status(200).send(sauces) })
      .catch(error => res.status(400).send(error))
};

function getSauce(req, res) {
   Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
         sauce.dsilikes = sauce.usersDisliked.length;
         sauce.likes = sauce.usersLiked.length;
         res.status(200).send(sauce)
      })
      .catch((error) => {
         res.status(400).send({ error })
      })
};

function createSauces(req, res) {
   // La requête est convertis en form/data (string) par multer il faut donc la parser
   const sauceObject = JSON.parse(req.body.sauce);
   // Suppression de l'userId reçu du client par sécurité
   delete sauceObject._id;
   const sauce = new Sauce({
      ...sauceObject,
      // Récupération de l'userId dans le jeton d'authorization (req.auth)
      userId: req.auth.userId,
      // Construction de l'URL pour stocker l'image dans le dossier pointé par le middlewear multer-conf.js
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
   });

   sauce.save()
      .then((message) => {
         res.status(201).send({ message: "Recette ajoutée" });
         return console.log("Produit enregistré !", message);
      })
      .catch(console.error)
};

function modifySauce(req, res) {
   const { params: { id } } = req;
   console.log("req.file", req.file);
   const hasNewImage = req.file != null;
   // Mise à jour de la nouvelle image et de son URL
   const payload = makePayload(hasNewImage, req);

   Sauce.findByIdAndUpdate(id, payload)
      // Test si la requête provient bien du propriétaire
      .then((dbResponse) => sendClientResponse(dbResponse, res))
      // suppression du fichier image
      .then((sauce) => deleteImage(sauce))
      // Vérifis que le fichier est supprimé
      .then((res) => console.log("FILE DELETED", res))
      .catch((err) => console.error("PROBLEM UPDATING", err))
};

function deleteImage(sauce) {
   if (sauce == null) return;
   console.log("DELETE IMAGE", sauce);
   // suppression de l'ancienne image
   const imageToDelete = sauce.imageUrl.split("/").at(-1);
   return unlink("images/" + imageToDelete);
};

function deleteSauce(req, res) {
   const { id } = req.params
   // 1. L'ordre de suppression est envoyé à Mongo
   Sauce.findByIdAndDelete(id)
      // Test si la requête  provient bien du propriétaire de la sauce 
      .then((sauce) => sendClientResponse(sauce, res))
      // suppression du fichier image
      .then((sauce) => deleteImage(sauce))
      // Vérifis que le fichier est supprimé
      .then((res) => console.log("FILE DELETED", res))
      .catch((err) => res.status(500).send({ message: err }))
}

//Test si la requête provient bien du propriétaire
function sendClientResponse(sauce, res) {
   if (sauce == null) {
      console.log("NOTHING TO UPDATE")
      //Il n'y a rien à mettre à jour ou l'objet est introuvable dans la base de donnée 
      return res.status(404).send({ message: "Object not found in database" })
   }
   // Tout va bien , mise à jour
   console.log("ALL GOOD, UPDATING:", sauce)
   // Mise à jour réussi
   return Promise.resolve(res.status(200).send({ message: "Successfully update" })).then(() => sauce)
}
// Mise à jour de la nouvelle image
function makePayload(hasNewImage, req) {
   console.log("hasNewImage:", hasNewImage)
   // si ce n'est pas une nouvelle image
   if (!hasNewImage) return req.body
   // on parse la requête
   const payload = JSON.parse(req.body.sauce)
   // mise à jour de l'URL de la nouvelle image
   payload.imageUrl = makeImageUrl(req, req.file.filename)
   console.log("Nouvelle image à gérer!!")
   console.log("Voici le payload:", payload)
   return payload
}

// mise à jour de l'URL de la nouvelle image
function makeImageUrl(req, fileName) {
   return req.protocol + "://" + req.get("host") + "/images/" + fileName
}



function likeSauce(req, res) {
   try {
      Sauce.findById(req.params.id)
         .then((sauce) => {
            // Suppression de l'userId si déjà présent dans les tableaux: userLiked et usersDisliked
            let likersIds = sauce.usersLiked.filter((idList) => idList !== req.auth.userId);
            let dsilikersIds = sauce.usersDisliked.filter((idList) => idList !== req.auth.userId);
            switch (req.body.like) {
               // lutilisateur like la sauce
               case 1:
                  likersIds.push(req.auth.userId);
                  break;
               // l'utilisteur dislike la sauce   
               case -1:
                  dsilikersIds.push(req.auth.userId);
            }
            sauce.usersLiked = likersIds;
            sauce.usersDisliked = dsilikersIds;
            sauce.save()
               .then(() => {
                  res.status(200).send({ message: "appréciation enregistrée " });
               });
         });
   } catch (error) { res.status(400).send({ error }) };
}


module.exports = { getAllSauces, getSauce, createSauces, modifySauce, deleteSauce, likeSauce }