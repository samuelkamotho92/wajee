const { query } = require("express");
const Tours = require("../model/tour");
const Queryoperetions = require("../utility/features");
// const catchAsyncfunc = require("../utility/catchAsync");
const catchAsyncFunc = require("../utility/catchAsyncFunc");
const Apperror = require("../utility/appError");

const gettopTours = catchAsyncFunc(async(req,resp,next)=>{
req.query.sort = '-price,-rating';
req.query.limit = '5';
next()
})
//call the catchAsyncfunc to catch the error
const getTours = catchAsyncFunc(async (req,resp,next)=>{
const queryString = req.query
// console.log(req.headers.cookie)
console.log(queryString)
   const features = new Queryoperetions(Tours.find(),queryString)
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

const postTour = catchAsyncFunc(async (req,resp,next)=>{
const booked = await Tours.create(req.body);
resp.status(201).json({
    status:"success",
    message:booked
}) 
console.log(req.body);
})

const getaTour =  catchAsyncFunc(async (req,resp,next)=>{
    const tourid = req.params.tourid;
    const onetour = await Tours.findById(tourid).populate('Reviews');
    if(!onetour){
        //create an error object
        return next(new Apperror(`cant find room with id ${tourid}`,404));
    }
    resp.status(200).json({
        status:"success",
        message:onetour
    })
    })
  

  const updateTour = catchAsyncFunc(async (req,resp,next)=>{
const tourid = req.params.tourid;
const updated = await Tours.findByIdAndUpdate(tourid,req.body,{
    new:true,
    runValidators:true
});
if(!updated){
    //create an error object
    return next(new Apperror(`cant find room with id ${tourid}`,404));
}
resp.status(200).json({
    status:"successfully updated",
    message:updated
})
console.log(updated)
  })

  const deleteTour =  catchAsyncFunc(async (req,resp,next)=>{
        const tourid = req.params.tourid;
      const deletedroom =  await Tours.findByIdAndDelete(tourid)
      if(!deletedroom){
        //create an error object
        return next(new Apperror(`cant find room with id ${tourid}`,404));
    }
        resp.status(200).json({
        status:"deleted succefully",
        data:null
        })
})

const getToursStat = catchAsyncFunc(async(req,resp,next)=>{
    const stats = await Tours.aggregate([
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
    getTours,
    postTour,
    getaTour,
    updateTour,
    deleteTour,
    gettopTours,
    getToursStat,
};