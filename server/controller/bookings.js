const { query } = require("express");
const roomsbooked = require("../model/booking");
const Queryoperetions = require("../utility/features");
const catchAsyncfunc = require("../utility/catchAsync");
const catchAsyncFunc = require("../utility/catchAsyncFunc");
const Apperror = require("../utility/appError");
//call the catchAsyncfunc to catch the error
const getRoomsbooked = catchAsyncfunc(async (req,resp,next)=>{
   const features = new Queryoperetions(roomsbooked.find(),queryString)
   .filter()
   .sort()
   .pagination()
   .limit()
   const booked = await features.queryData;
    resp.status(200).json({
        status:"success",
        message:booked
    });
})

const postRoom = catchAsyncFunc(async (req,resp)=>{
const {name,rating,price} = req.body;
const booked = await roomsbooked.create(req.body);
resp.status(201).json({
    status:"success",
    message:booked
}) 
console.log(req.body);
})

const getaRoom =  catchAsyncFunc(async (req,resp,next)=>{
    const id = req.params.id;
    const oneroom = await roomsbooked.findById(id);
    if(!oneroom){
        //create an error object
        return next(new Apperror(`cant find room with id ${id}`,404));
    }
    resp.status(200).json({
        status:"success",
        message:oneroom
    })
    })
  

  const updateRoom = catchAsyncFunc(async (req,resp)=>{
const id = req.params.id;
const updated = await roomsbooked.findByIdAndUpdate(id,req.body,{
    new:true,
    runValidators:true
});
if(!updated){
    //create an error object
    return next(new Apperror(`cant find room with id ${id}`,404));
}
resp.status(200).json({
    status:"successfully updated",
    message:updated
})
console.log(updated)
  })

  const deleteRoom =  catchAsyncFunc(async (req,resp)=>{
        const id = req.params.id;
      const deletedroom =  await roomsbooked.findByIdAndDelete(id)
      if(!deletedroom){
        //create an error object
        return next(new Apperror(`cant find room with id ${id}`,404));
    }
        resp.status(200).json({
        status:"deleted succfully",
        data:null
        })
})

module.exports = {
    getRoomsbooked,
    postRoom,
    getaRoom,
    updateRoom,
    deleteRoom
};