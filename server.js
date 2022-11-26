const dotenv = require("dotenv");
dotenv.config()
const express = require("express")
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser")
const port = 3000

// Connection base de données
const mongo = require("./mongo")

// Controllers
const {createUser, logUser} = require("./Controllers/users")
const {roadSauces, createSauces} = require("./Controllers/sauces")

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

const {authenticateUser} = require("./Middleware/auth")
const multer = require("multer")
const upload = multer().single("image");
// Routes
app.post('/api/auth/signup', createUser)
app.post('/api/auth/login', logUser)
app.get('/api/sauces', authenticateUser,roadSauces)
app.post('/api/sauces', authenticateUser, upload, createSauces)
app.get('/', (req, res) => { res.send("hello World !") });

//Listen
app.listen(port, () => { console.log("Listening on port" + port) });
  