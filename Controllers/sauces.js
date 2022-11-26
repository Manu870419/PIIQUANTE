const mongoose = require("mongoose")

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
   console.log("le token a été validé, nous sommes dans roadSauces")
   //console.log("le token à l'air bon", decoded)
   Product.find({}).then(products => res.send(products))
   //res.send({message:[{ sauce: "sauce1"}, { sauce: "sauce1"}]})

}

function createSauces(req, res) {
   const name = req.body.name
   const manufacturer = req.body.manufacturer
   console.log({ body: req.body })

   const product = new Product({
      userId: "pouet",
      name: "pouet",
      manufacturer: "pouet",
      mainPepper: "pouet",
      imageUrl: "pouet",
      heat: 2,
      likes: 2,
      dsilikes: 2,
      usersLiked: ["pouet"],
      usersDisliked: ["pouet"]
   })
   product.save().then((res) => console.log("Produit enregistré !", res)).catch(console.error)
}

module.exports = { roadSauces, createSauces}