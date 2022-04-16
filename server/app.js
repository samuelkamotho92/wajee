const express = require("express");
const bodyParser = require("body-parser")
const morgan = require("morgan")
const bookings =  require("./router/bookingrouter");
const Apperror = require("./utility/appError")
const globalError = require("./controller/errorController");
const app = express();

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1/bookings",bookings);

app.use('*',(req,resp,next)=>{
    //create an error object
  const err = new Apperror(`cant locate ${req.originalUrl}`,404);
//pass our error in the next 
next(err);
})
//error handling middlware
app.use(globalError);
module.exports =  app;