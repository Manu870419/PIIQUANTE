const {app,express} = require("./server")
const port = 3000
const path = require("path")


// Connection base de données
const mongo = require("./mongo")

// Controllers
const {createUser, logUser} = require("./Controllers/users")
const {roadSauces, createSauces, roadSauceById, deleteSauce} = require("./Controllers/sauces")

// Middleware
const {upload} = require("./Middleware/multer")
const {authenticateUser} = require("./Middleware/auth")


// Routes
app.post('/api/auth/signup', createUser)
app.post('/api/auth/login', logUser)
app.get('/api/sauces', authenticateUser,roadSauces)
app.post('/api/sauces', authenticateUser, upload.single("image"), createSauces)
app.get("/api/sauces/:id", authenticateUser, roadSauceById)
app.delete("/api/sauces/:id", authenticateUser, deleteSauce)
app.get('/', (req, res) => { res.send("hello World !") });

//Listen
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () => { console.log("Listening on port" + port) });
  