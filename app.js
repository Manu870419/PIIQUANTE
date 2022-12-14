const express = require('express');
const app = express();
const helmet = require("helmet");
const mongoose = require('mongoose');
const usersRouter = require('./routers/users');
const saucesRouter = require('./routers/sauces');
const path = require('path');
// récupperation des identifiants de connection dans le fichier '.env'
const dotenv = require("dotenv");
dotenv.config()
const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
const db = process.env.DB_NAME
const uri = `mongodb+srv://${username}:${password}@cluster0.1dgaomk.mongodb.net/${db}?retryWrites=true&w=majority`;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((() => console.log("Connected to Mongo!")))
  .catch(err => console.error("Error connecting to Mongo", err));

//*********          ROUTES             ********//

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
//app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


app.use('/api/auth', usersRouter);
app.use('/api/sauces', saucesRouter);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;