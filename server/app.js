const express = require("express");
const bodyParser = require("body-parser")
const morgan = require("morgan")
const tours =  require("./router/tourRouter");
const authentication = require('./router/authrouter');
const reviews = require('./router/reviewsRouter')
const Apperror = require("./utility/appError");
const globalError = require("./controller/errorController");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const app = express();
app.set('view engine','ejs');
app.use(helmet());
if(process.env.NODE_ENV === 'development'){
  app.use(morgan("tiny"));
}
const limiter = rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:'Too many accounts created from this IP, please try again after an hour'
})
app.use("/api",limiter);
app.use(mongoSanitize());
app.use(xss());
// app.use(hpp());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1/tours",tours);
app.use("/api/v1/user",authentication);
app.use("/api/v1/reviews",reviews);
app.get('/',(req,resp)=>{
  resp.render('index')
  console.log(req.headers)
})
app.all('*',(req,resp,next)=>{
    //create an error object
//pass our error in the next 
next(new Apperror(`cant locate ${req.originalUrl}`,404));
})
//error handling middlware
app.use(globalError);
module.exports =  app;