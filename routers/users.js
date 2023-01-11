const { createUser, logUser } = require('../controllers/users');
const express = require('express');
const usersRouter = express.Router();

usersRouter.post('/signup', createUser)
usersRouter.post('/login', logUser)

module.exports = usersRouter;