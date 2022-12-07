const mongoose = require("mongoose")

const sauceSchema = new mongoose.Schema({
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
 });

  module.exports = mongoose.model("Sauce", sauceSchema)