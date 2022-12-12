const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
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
   }
})

AuthSchema.pre('save',async function(next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    this.passwordConfirm = undefined;
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


const Authmodel = mongoose.model('User',AuthSchema);
module.exports = Authmodel
