const authmodel = require('../model/authmodel');
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsyncFunc');
const {promisify} = require("util");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsyncFunc = require('../utility/catchAsyncFunc'); 
//in seconds
let maxAge = 30*24*60*60
const createJWT = (id)=>{
return jwt.sign({id},process.env.JWT_SECRET,{
expiresIn:maxAge
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
if(!email || !password){
   return next(new AppError("provide email and password",400));
}
const loggedMember = await authmodel.login(email,password);
if(!loggedMember){
    return next(new AppError("incorrect password or email",401));
}
console.log(loggedMember);
const id = loggedMember._id;
const tk = createJWT(id);
resp.cookie("Wajee",tk,{httpOnly:true,maxAge: maxAge* 1000});
resp.status(200).json({
    status:'success',
    data:{
        loggedMember
    },
    tk
})
resp.status(200).json({
status:'success',
data:{
   loggedMember
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
const userExist = await authmodel.findById(decoded.id);
if(!userExist){
    return next(new AppError("User does not exist",401))
}
console.log(userExist)

if(userExist.changePasswordAfter(decoded.iat)){
    return next(new AppError("user changed password recently"));
}
req.user = userExist
    next()
})

module.exports = {
    signUpUser,
    signInUser,
    protectRoutes
};