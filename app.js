const express = require("express")
const cors = require("cors")
const app = express();
const port = 3000


// Middleware
app.use(cors())

// Routes
app.post('/api/auth/signup',)
app.get('/', (req,res) =>{res.send("hello World !")});
app.listen(port, () => {console.log("Listening on port" + port)});