const { json } = require('body-parser');
const reviewmodel = require('../model/reviews');
const AppError = require('../utility/appError');
const catchAsyncFunc = require('../utility/catchAsyncFunc');
const createReviews =  catchAsyncFunc(async (req,resp,next)=>{
    if(!req.body.tour) req.body.tour = req.params.tourid;
    if(!req.body.user) req.body.user = req.user.id;
const reviews = await reviewmodel.create(req.body)
if(!reviews){
    return next(new AppError('Reviews does not exist on the tour',404));
}
resp.status(201).json({
    status:'success',
    data:{
        reviews
    }
})
    next()
})
const getReviews = catchAsyncFunc(async(req,resp,next)=>{
const reviewed = await reviewmodel.find();
if(!reviewed){
    return next(new AppError('No reviews made yet',400))
}
resp.status(200).json({
    status:'success',
    data:{
        reviewed
    }
})
    next()
})

module.exports = {
    createReviews,
    getReviews
}