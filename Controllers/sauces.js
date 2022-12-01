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
   const {body, file} = req
   const {fileName} = file
   const sauce = JSON.parse(body.sauce)
   const {name, manufacturer, description, mainPepper, heat, userId} = sauce
   function makeImageUrl(req, fileName){
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
   product.save().then((res) => console.log("Produit enregistré !", res)).catch(console.error)
}

module.exports = { roadSauces, createSauces}