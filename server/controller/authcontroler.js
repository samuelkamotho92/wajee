const authmodel = require('../model/authmodel');
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsyncFunc');
const {promisify} = require("util");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsyncFunc = require('../utility/catchAsyncFunc'); 

const sendEmail = require("../utility/email");
const crypto = require('crypto');
//in seconds
let maxAge = 30*24*60*60
const createJWT = (id)=>{
return jwt.sign({id},process.env.JWT_SECRET,{
expiresIn:process.env.JWT_EXPIRES
    })
}

const signUpUser = catchAsync(async(req,resp,next)=>{
const signedUpUser = await authmodel.create(req.body);
const id = signedUpUser._id;
const tk = createJWT(id);
resp.cookie("wajee",tk,{httpOnly:true,maxAge: maxAge* 1000});
resp.status(201).json({
status:'success',
data:{
    signedUpUser
},
token:tk
})
});

const signInUser = catchAsync(async(req,resp,next)=>{
const {email,password} = req.body;
console.log(email,password)
if(!email || !password){
   return next(new AppError("provide email and password",400));
}
const user = await authmodel.findOne({email}).select('+password');
console.log(user);
const id = user._id;
const tk = createJWT(id);
resp.cookie("wajee",tk,{httpOnly:true,maxAge: maxAge* 1000});
const correct = await user.correctPassword(password,user.password)
if(!user || !correct){
return next(new AppError("incorrect email or password",401));
}
resp.status(200).json({
    status:"success",
    data:{
        user
    },
    token:tk
})
});

const protectRoutes = catchAsyncFunc(async(req,resp,next)=>{
    let token;
    console.log(req.headers.authorization)
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    console.log(req.headers.authorization.split(" "))
    token = req.headers.authorization.split(" ")[1];
    console.log(token)
}
if(!token){
    return next(new AppError("please login , you are not authorised",401))
}
const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
let currentUser = await authmodel.findById(decoded.id);
if(!currentUser){
    return next(new AppError("User does not exist",401))
}
console.log(currentUser)
if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
req.user = currentUser
console.log(req.user.role,'user details')
    next()
})

const restrict = (...roles)=>{
    return (req,resp,next)=>{
        console.log(req.user.role)
if(!roles.includes(req.user.role)){
    return next(new AppError("User restricted to delete",403));
}
next();
    }
}

const forgotPassword = catchAsyncFunc(async(req,resp,next)=>{
   const {email} = req.body;
    let getUser = await authmodel.findOne({email})
    if(!getUser){
return next(new AppError("User does not exist",404))
    }
    const tokenGen = await getUser.createResetpassToken();
    console.log(tokenGen);
     //don't change db
     await getUser.save({validateBeforeSave:false});
     const resetUrl = 
    `${req.protocol}://localhost:3000/resetPassword`;
    console.log(resetUrl);
    const message = 
    `sorry,we heard you lost your password, don't worry click here to reset it: ${tokenGen}`
        
    try{
        await sendEmail({
                email:getUser.email,
                subject:'your reset token ,expires in the next 24hrs',
                url:resetUrl,
                message:message
            })
            resp.status(200).json({
            status:'success',
            resetToken:tokenGen,
            message
        })
    }catch(err){
        getUser.passwordResetToken = undefined;
        getUser.resetTokenExpires = undefined;
        await getUser.save({validateBeforeSave:false});
return next(new AppError("Oops Ooops email not sent try again",500));
    }
    
    next()
})

const resetPassword = catchAsyncFunc(async(req,resp,next)=>{
  
    const token = req.params.token
    console.log(token)
        const hashToken = crypto.createHash('sha256').update(token).digest('hex');
        console.log(hashToken,'hashed value');
    const getUser = await authmodel.findOne({
        passwordResetToken:hashToken,
        resetTokenExpires:{$gt:Date.now()}})
    console.log(getUser);
    if(!getUser){
        return next(new AppError("user is not found",404))
    }
    if(getUser){
        getUser.password = req.body.password;
        getUser.passwordConfirm = req.body.passwordConfirm;
        getUser.resetTokenSetAt = Date.now();
        getUser.passwordResetToken = undefined;
        getUser.resetTokenExpires = undefined;
        await getUser.save()
        const token = createJWT(getUser._id);
        resp.status(200).json({
        status:'success',
        message:'password updated succesfully',
        token
    })
    }
next();
})

const updatedPassword = catchAsyncFunc(async(req,resp,next)=>{
    console.log(req.user.id,'user id')
const currentUser = await authmodel.findById(req.user.id).select('+password');
console.log(currentUser.password)
// const passwordPassed = currentUser.login(currentUser.email,currentUser.password);
if(!currentUser.correctPassword(req.body.passwordCurrent,currentUser.password)){
    return next(new AppError("user does not exist",404))
}
currentUser.password = req.body.password;
currentUser.passwordConfirm = req.body.passwordConfirm;
await currentUser.save();

const token = createJWT(currentUser._id);
resp.cookie("wajee",token,{httpOnly:true,maxAge: maxAge* 1000});
resp.status(200).json({
    status:'success',
    data:{
        currentUser
    },
    token:token
})
})


const createUser = (req,resp)=>{
    resp.status(200).json({
        status:'success',
        message:'not yet defined use the sign up route'
    })
}

module.exports = {
    signUpUser,
    signInUser,
    protectRoutes,
    restrict,
    forgotPassword,
    resetPassword,
    updatedPassword,
    createUser
};