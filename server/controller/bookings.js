const { query } = require("express");
const roomsbooked = require("../model/booking");
const Queryoperetions = require("../utility/features");
// const catchAsyncfunc = require("../utility/catchAsync");
const catchAsyncFunc = require("../utility/catchAsyncFunc");
const Apperror = require("../utility/appError");

const gettopRooms = catchAsyncFunc(async(req,resp,next)=>{
req.query.sort = '-price,-rating';
req.query.limit = '5';
next()
})
//call the catchAsyncfunc to catch the error
const getRoomsbooked = catchAsyncFunc(async (req,resp,next)=>{
const queryString = req.query
// console.log(req.headers.cookie)
console.log(queryString)
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

const postRoom = catchAsyncFunc(async (req,resp,next)=>{
const {name,rating,price} = req.body;
const booked = await roomsbooked.create(req.body);
resp.status(201).json({
    status:"success",
    message:booked
}) 
console.log(req.body);
})

const getaRoom =  catchAsyncFunc(async (req,resp,next)=>{
    const roomid = req.params.roomid;
    const oneroom = await roomsbooked.findById(roomid);
    if(!oneroom){
        //create an error object
        return next(new Apperror(`cant find room with id ${roomid}`,404));
    }
    resp.status(200).json({
        status:"success",
        message:oneroom
    })
    })
  

  const updateRoom = catchAsyncFunc(async (req,resp,next)=>{
const roomid = req.params.roomid;
const updated = await roomsbooked.findByIdAndUpdate(roomid,req.body,{
    new:true,
    runValidators:true
});
if(!updated){
    //create an error object
    return next(new Apperror(`cant find room with id ${roomid}`,404));
}
resp.status(200).json({
    status:"successfully updated",
    message:updated
})
console.log(updated)
  })

  const deleteRoom =  catchAsyncFunc(async (req,resp,next)=>{
        const roomid = req.params.roomid;
      const deletedroom =  await roomsbooked.findByIdAndDelete(roomid)
      if(!deletedroom){
        //create an error object
        return next(new Apperror(`cant find room with id ${roomid}`,404));
    }
        resp.status(200).json({
        status:"deleted succfully",
        data:null
        })
})

const getRoomsStat = catchAsyncFunc(async(req,resp,next)=>{
    const stats = await roomsbooked.aggregate([
        {
            $match:{rating:{gte:4.5}}
        },
        {
            $group:{
                _id:'$rating',
                numRooms:{$sum:1},
                avgRating:{$avg:"$rating"},
                avgPrice:{$avg:"$price"},
                maxPrice:{$max:"$price"},
                minPrice:{$min:"$price"}
            }
        },
        {
            $sort:{
                $avgprice:1
            }
        }
    ]);
    resp.status(200).json({
        status:'success',
        data:stats
    })
})



module.exports = {
    getRoomsbooked,
    postRoom,
    getaRoom,
    updateRoom,
    deleteRoom,
    gettopRooms,
    getRoomsStat,
};