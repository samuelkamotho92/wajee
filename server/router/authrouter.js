const authControler = require('../controller/authcontroler');
const  express = require('express');
const authRouter = express.Router()

authRouter.post("/signup",authControler.signUpUser);
authRouter.post('/login',authControler.signInUser)

module.exports = authRouter
