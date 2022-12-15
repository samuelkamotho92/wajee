const authControler = require('../controller/authcontroler');
const reviewControler = require('../controller/reviews');
const  express = require('express');

const authRouter = express.Router()

authRouter.post("/signup",authControler.signUpUser);
authRouter.post('/login',authControler.signInUser);
authRouter.post('/forgotpass',authControler.forgotPassword);
authRouter.patch('/resetpass/:token',authControler.resetPassword);
authRouter.patch('/updatepassword',authControler.protectRoutes,authControler.updatedPassword);
authRouter.patch('/updateme',authControler.protectRoutes,authControler.updateme)
authRouter.delete('/deleteme',authControler.protectRoutes,authControler.deleteMe)


module.exports = authRouter
