const {User} = require("../mongo")
const bcrypt = require("bcrypt")

async function createUser(req, res) {
    const {email, password} = req.body
    const hashedPassword = await hashPassword(password)
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

async function logUser (req, res){
    const {email, password} = req.body
    const user = await User.findOne({email: email})

    const isPasswordOk = await bcrypt.compare(password, user.password)
    if (!isPasswordOk) {
        res.status(403).send({message:"Mot de passe incorrect !"})
    }
    if (isPasswordOk) {
        res.status(200).send({message:"connexion réussi"})
    }
}


module.exports = {createUser, logUser}