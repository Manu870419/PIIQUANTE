const mongoose = require("mongoose")
const unlink = require("fs").promises.unlink

const productSchema = new mongoose.Schema({
   userId: String,
   name: String,
   manufacturer: String,
   mainPepper: String,
   imageUrl: String,
   heat: Number,
   likes: Number,
   dsilikes: Number,
   usersLiked: [String],
   usersDisliked: [String]
})
const Product = mongoose.model("Product", productSchema)

function roadSauces(req, res) {
   Product.find({})
      .then(products => {res.send(products)})
      .catch(error => res.status(500).send(error))
}

async function roadSauceById(req, res) {
   try {
      const { id } = req.params
      const product = await Product.findById(id)
      res.send(product)
   } catch (error) {
      res.status(500).send(error)
   }
}

function deleteSauce(req, res){
   const {id} = req.params

   // 1. L'ordre de suppression du Produit est envoyé à Mongoo
   Product.findByIdAndDelete(id)
      // 2. Supprimer l'image localement 
      .then(deleteImage)
      // 3. Envoyer un message de succès au site web (client)
      .then((product) => res.send({ message: product }))
      .catch((err) => res.status(500).send({ message: err}))
}

function deleteImage(product){
   const imageUrl = product.imageUrl
   const fileToDelete = imageUrl.split("/").at(-1)
   unlink(`images/${fileToDelete}`).then(() => product)
}

function createSauces(req, res) {
   const { body, file } = req
   const { fileName } = file
   const sauce = JSON.parse(body.sauce)
   const { name, manufacturer, description, mainPepper, heat, userId } = sauce
   function makeImageUrl(req, fileName) {
      return req.protocol + "://" + req.get("host") + "/images/" + fileName
   }

   const product = new Product({
      userId: userId,
      name: name,
      manufacturer: manufacturer,
      mainPepper: mainPepper,
      imageUrl: makeImageUrl(req, fileName),
      heat: heat,
      likes: 0,
      dsilikes: 0,
      usersLiked: [],
      usersDisliked: []
   })
   product.save()
      .then((message) => {
         res.status(201).send({ message: message })
         return console.log("Produit enregistré !", message)
      }).catch(console.error)
}

module.exports = { roadSauces, createSauces, roadSauceById, deleteSauce }