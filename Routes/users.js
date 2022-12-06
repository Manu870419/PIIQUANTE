const express = require('express');
const ctrlUser = require('../Controllers/users')
const router = express.Router();

router.post('/signup', ctrlUser.createUser)
router.post('/login', ctrlUser.logUser)

module.exports = {router};