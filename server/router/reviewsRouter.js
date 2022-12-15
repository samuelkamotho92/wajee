const express = require('express');
const reviews =  require('../controller/reviews');
const authcontroler = require('../controller/authcontroler');
const reviewRouter = express.Router();
reviewRouter.route('/')
.get(reviews.getReviews)
.post(
authcontroler.protectRoutes,
authcontroler.restrict('user'),
reviews.createReviews);

module.exports = reviewRouter