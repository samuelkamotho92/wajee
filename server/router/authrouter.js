const authControler = require('../controller/authcontroler');
const  express = require('express');
const authRouter = express.Router()

authRouter.post("/signup",authControler.signUpUser);
authRouter.post('/login',authControler.signInUser);
authRouter.post('/forgotpass',authControler.forgotPassword);
authRouter.post('/resetpass/:token',authControler.resetPassword);


module.exports = authRouter
