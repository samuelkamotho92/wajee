const express = require("express");
const tours = require("../controller/tours");
const authcontroler = require("../controller/authcontroler");
const reviewControler = require('../controller/reviews');
const tourRouter = express.Router();

tourRouter.route('/cheaptours')
.get(tours.gettopTours,tours.getTours)

tourRouter.route('/tour-stats')
.get(tours.getToursStat)

tourRouter.route('/')
.get(authcontroler.protectRoutes,tours.getTours)
.post(tours.postTour);

tourRouter.route('/:tourid')
.get(tours.getaTour)
.patch(tours.updateTour)
.delete(
    authcontroler.protectRoutes,
    authcontroler.restrict('admin'),
     tours.deleteTour)
     tourRouter.route('/:tourid/reviews').post(
        authcontroler.protectRoutes,
        authcontroler.restrict('user'),
        reviewControler.createReviews)


module.exports = tourRouter;

