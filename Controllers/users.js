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
        .then(() => res.send({ message: "utilisateur enregistré !" }))
        .catch(err => console.log("User pas enregistré", err))
}

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password,saltRounds)
}

module.exports = {createUser}