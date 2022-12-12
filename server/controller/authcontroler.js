const authmodel = require('../model/authmodel');
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsyncFunc');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
module.exports = {
    signUpUser,
    signInUser
};