const authControler = require('../controller/authcontroler');
const usercontroler = require('../controller/userControler');
const  express = require('express');
const authRouter = express.Router()
authRouter.post("/signup",authControler.signUpUser);
authRouter.post('/login',authControler.signInUser);
authRouter.post('/forgotpass',authControler.forgotPassword);
authRouter.patch('/resetpass/:token',authControler.resetPassword);

authRouter.use(authControler.protectRoutes);
authRouter.patch('/updatepassword',authControler.updatedPassword);
authRouter.patch('/updateme',usercontroler.updateMe);
authRouter.delete('/deleteme',usercontroler.deleteMe);
//get the user
authRouter.get('/me',usercontroler.getMe,usercontroler.getUser);
authRouter.get('/getall',usercontroler.getAllUsers);
//get all users in the db



module.exports = authRouter
