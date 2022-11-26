const dotenv = require("dotenv");
dotenv.config()
const express = require("express")
const cors = require("cors")
const app = express();
const port = 3000

// Connection base de données
const mongo = require("./mongo")

// Controllers
const {createUser, logUser} = require("./Controllers/users")
const {saucesRoutes, createSauces} = require("./Controllers/sauces")

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/auth/signup', createUser)
app.post('/api/auth/login', logUser)
app.get('/api/sauces', saucesRoutes)
app.post('/api/sauces', createSauces)
app.get('/', (req, res) => { res.send("hello World !") });

//Listen
app.listen(port, () => { console.log("Listening on port" + port) });
  