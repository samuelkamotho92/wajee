const express = require("express");
const bodyParser = require("body-parser")
const bookings =  require("./router/bookingrouter");
const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/api/v1/bookings",bookings);
module.exports =  app;