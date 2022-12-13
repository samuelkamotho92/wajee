const express = require("express");
const bodyParser = require("body-parser")
const morgan = require("morgan")
const bookings =  require("./router/bookingrouter");
const authentication = require('./router/authrouter');
const Apperror = require("./utility/appError");
const globalError = require("./controller/errorController");
const app = express();
app.set('view engine','ejs');
if(process.env.NODE_ENV === 'development'){
  app.use(morgan("tiny"));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1/bookings",bookings);
app.use("/api/v1/user",authentication);
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