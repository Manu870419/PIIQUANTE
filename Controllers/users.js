const {User} = require("../mongo")
const bcrypt = require("bcrypt")

async function createUser(req, res) {
    const {email, password} = req.body

    const hashedPassword = await hashPassword(password)

    console.log('passeword:', password)
    console.log('hasedPassword:', hashedPassword)
    const user = new User({ email, password:hashedPassword })

    user
        .save()
        .then(() => res.status(201).send({ message: "utilisateur enregistré !" }))
        .catch(err => res.status(409).send({ message:"User pas enregistré :"+ err}))
}

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password,saltRounds)
}

function logUser (req, res){
    const email = req.body.email
    const passeword = req.body.password
}

module.exports = {createUser, logUser}