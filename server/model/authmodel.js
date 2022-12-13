const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const AuthSchema = new Schema({
    firstname:{
        type:String,
        required:[true,'Please enter your frist name']
    },
    lastname:{
        type:String,
        required:[true,'Please enter your last name']
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        unique:true,
       validate:[isEmail,'Please enter correct email'],
       lowercase:true
    },
    photo:String,
    password:{
        type:String,
        required:[true,'Please enter your password'],
        minlength:[8,'please enter a 8 or more charater ']
    },
   passwordConfirm:{
    type:String,
    required:[true,'Please enter your password confirmation'],
    validate:{
        validator:function (val) {
            return val === this.password
        },
        message:'please enter correct password confirmation'
    },
   },
   role:{
    type:String,
    required:[true,'please enter your role'],
    enum:["admin","user"],
    default:"user"
   },
   passwordChangedAt:Date,
   passwordResetToken:String,
   resetTokenSetAt:Date,
   resetTokenExpires:Date
})

AuthSchema.pre('save',async function(next) {
    if(!this.isModified("password") || this.isNew) return next();
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    this.passwordConfirm = undefined;
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

AuthSchema.statics.login = async function (email,password) {
    const member = await this.findOne({email}); 
    if(member)
    {
  const auth = await bcrypt.compare(password,member.password);
  if(auth){
 return member;
  }
    }
  }
AuthSchema.methods.changePasswordAfter = async function (timestamp) {
    if(this.passwordChangedAt){
    const changeTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
    console.log(changeTimestamp,timestamp);
    return timestamp < changeTimestamp
}
    return false
    
  }

  AuthSchema.methods.createResetpassToken = async function () {
    const token = crypto.randomBytes(32).toString('hex');
 this.passwordResetToken = crypto.createHash("sha256").update(token).digest('hex');
 this.resetTokenExpires = Date.now() + 1 * 24 * 60 * 60 * 1000;
return token
  }


const Authmodel = mongoose.model('User',AuthSchema);
module.exports = Authmodel
