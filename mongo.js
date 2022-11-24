/*const mongoose = require('mongoose');
const uri = "mongodb+srv://Emmanuel87:<password>@piiquante.rr4w20y.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri).then((() => console.log("Connected to Mongo !"))).catch(err => console.error
("Error connecting to Mongo", err));*/
const mongoose = require("mongoose");
const password = "zEHcvLGnfAawJ0aQ"
const uri = `mongodb+srv://Emmanuel87:${password}@piiquante.rr4w20y.mongodb.net/?retryWrites=true&w=majority`;


mongoose
    .connect(uri)
    .then((() => console.log("Connected to Mongo!")))
    .catch(err => console.error("Error connecting to Mongo", err));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema)

module.exports = {mongoose, User}