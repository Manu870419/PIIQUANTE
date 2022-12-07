const Sauce = require("../models/sauces")
const fs = require("fs")

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
      });
};


function createSauces(req, res) {
   console.log(sauceObject)
   // La requête est convertis en form/data (string) par multer il faut donc la parser
   const sauceObject = JSON.parse(body.sauce);
   // Suppression de l'userId reçu du client par sécurité
   delete sauceObject._id;
   const sauce = new Sauce({
      ...sauceObject,
      // Récupération de l'userId dans le jeton d'authorization (req.auth)
      userId: req.auth.userId,
      // Construction de l'URL pour stocker l'image dans le dossier pointé par le middlewear multer-conf.js
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
   })

   product.save()
      .then((message) => {
         res.status(201).send({ message: "Recette ajoutée" })
         return console.log("Produit enregistré !", message)
      })
      .catch(console.error)
}

async function modifySauce(req, res) {
   const sauceTargeted = await Sauce.findById(req.params.id)
   let sauceUpdate = {};// contiendra le corp de requête
   const invalidUser = sauceTargeted != req.auth.userId;
   // si tentative de modification de la sauce d'un autre user
   if (invalidUser) {
      res.status(403).send({ message: "Non-autorisé !" });
   } else {
      // Test si la requête contient un fichier form/Data (= stringifié par multer)
      if (req.file) {
         // Parser la requête
         sauceUpdate = { ...JSON.parse(req.body.sauce) };
         //suppression de l'ancienne image
         let oldPic = sauceTargeted.imageUrl.split("/images/")[1];
         fs.unlinkSync(`images/${oldPic}`);
         // mise à jour de l'URL de la nouvelle image
         sauceUpdate.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
      } else {
         sauceUpdate = { ...req.body };
      }
   }
   delete sauceUpdate.userId; // Ne pas faire confiance à l'userId de la requête!!!
   // Sauvegarde de la mise à jour dans la base de données
   Sauce.updateOne(
      { _id: req.params.id },
      // réécrire l'_id présent dans l'url pour le cas ou un autre _id serait inséré dans le body
      { ...sauceUpdate, _id: req.params.id }
   )
      .then(res.status(200).send({ message: "Sauce mise à jour !" }))
      .catcth((error) => res.status(400).send({ error }));
};

function deleteSauce(req, res) {
   const { id } = req.params
   // Ciblage de la sauce à modifier avec l'id présent dans l'url
   Sauce.findByIdAndDelete(id)
      .then((sauce) => {
         // Test si la requête ne provient pas du propriétaire de la sauce
         if (sauce.userId != req.auth.userId) {
            res.status(401).send({ message: "Non-autorisé" }); 
         }// Si la requête provient bien du propriétaire: récupération du nom du fichier 
         else {
            const filename = sauce.imageUrl.split("/images/")[1];
            // suppression du fichier image
            fs.unlink(`image/${filename}`,
            // puis suppression définitive de l'objet/sauce dans la Base de données.
               () => {
                  sauce.deleteOne({ _id: req.params.id })
                     .then(() => {
                        res.status(200).send({ message: "Sauce supprimée" });
                     })
                     .catch((error) => {
                        res.status(400).send({ error });
                     })
               })
         }
      })
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