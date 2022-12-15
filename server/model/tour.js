const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//  const User = require("./authmodel");
const slug = require('slugify');
const tourSchema = new Schema(
{
name:{
    type:String,
    unique:[true,"tour has alredy been booked"],
    required:[true,'please enter room name'],
},
slug: String,
duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
price:{
    type:Number,
    required:[true,'please enter the price']
},
priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        // this only points to current doc on NEW document creation
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price'
    }
  },
createdAt:{
    type:Date,
    default: Date.now()
},
summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
startLocation:{
    type:{
        type:String,
        default:'Point',
        enum:['Point']
    },
    coordiantes:[Number],
    address:String,
    description:String
},
locations: [
  {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String,
    day: Number
  }
],
guides:[
  {
    type: mongoose.Schema.ObjectId,
    ref:'User'
  } 
],
reviews:[
  {
type:mongoose.Schema.ObjectId,
ref:'review'
  }

]
},
{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
}
)
// tourSchema.pre("save",async function (next) {
//  const guidesPromise = this.guides.map(async id=>{
// await User.findById(id)
//   });
// this.guides = await Promise.all(guidesPromise)
//   next()
// }) 

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/,function (next) {
  this.populate({
    path:'guides',
    select:'-__v'
})
next();
})


tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

tourSchema.virtual('Reviews',{
  ref:'review',
  foreignField:'tour',
  localField:'_id'
})


const Tours = mongoose.model("tours",tourSchema);
module.exports = Tours;