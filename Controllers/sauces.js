const jwt = require("jsonwebtoken")
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

function saucesRoutes(req, res) {
   const header = req.header("Authorization")
   if (header == null) return res.status(403).send({ message: "Invalide" })

   const token = header.split(" ")[1]
   if (token == null) return res.status(403).send({ message: "Token cannot be null" })

   jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => handleToken(err, decoded, res))
}


function handleToken(err, decoded, res) {
   if (err) res.status(403).send({ message: "Token invalide" + err })
   else{ 
      console.log("le token à l'air bon", decoded)
      Product.find({}).then(products => res.send(products))
      //res.send({message:[{ sauce: "sauce1"}, { sauce: "sauce1"}]})
   }
}

function createSauces(req, res) {
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

module.exports = { saucesRoutes, createSauces }