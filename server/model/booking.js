const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookingSchema = new Schema(
{
name:{
    type:String,
    unique:[true,"room has alredy been booked"],
    required:[true,'please enter room name']
},
rating:{
    type:Number,
    default:4.5
},
price:{
    type:Number,
    default:1000
}
})

const Roombookings = mongoose.model("roombooking",bookingSchema);
module.exports = Roombookings;