const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookingSchema = new Schema(
{
name:{
    type:String,
    unique:[true,"room has alredy been booked"],
    required:[true,'please enter room name'],
},
rating:{
    type:Number,
    default:4.5,
    min:[1,'rating must be a minimum of 1.0'],
    max:[5,'rating must be a maximum of 5.0']
},
price:{
    type:Number,
    default:1000
},
createdAt:{
    type:Date,
    default: Date.now()
}
})

const Roombookings = mongoose.model("roombooking",bookingSchema);
module.exports = Roombookings;