const dotenv = require("dotenv");
dotenv.config()
const express = require("express")
const cors = require("cors")
const app = express();
const port = 3000

console.log("Variable d'environnement:",process.env.MOTDEPASSE)

// Connection base de données
const mongo = require("./mongo")

// Controllers
const {createUser} = require("./Controllers/users")


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/auth/signup', createUser)
app.get('/', (req, res) => { res.send("hello World !") });

//Listen
app.listen(port, () => { console.log("Listening on port" + port) });
  