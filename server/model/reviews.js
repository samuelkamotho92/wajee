const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
review:{
type:String,
required:[true,'please enter a review']
    },
rating:{
    type:Number,
    min:1,
    max:5,
    default:4.5
},
createdAt:{
    type:Date,
    default:Date.now()
},
tour:{
    type:mongoose.Schema.ObjectId,
    ref:'tours',
    required:[true,'A review should be linked to a tour']
},
user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:[true,'A review should be linked to a user']
},
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}

)

reviewSchema.pre(/^find/,function (next) {
    this.populate({
      path:'tour',
      select:'name'
  }).populate({
    path:'user',
    select:'firstname'
  })
  next();
  })



const Reviewmodel = mongoose.model('review',reviewSchema);
module.exports = Reviewmodel
