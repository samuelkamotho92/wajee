const express = require('express');
const tourController = require('../controller/tours');
const authController = require('../controller/authcontroler');
const reviewRouter = require('../router/reviewsRouter');

const router = express.Router();

// router.param('id', tourController.checkID);

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protectRoutes,
    authController.restrict('admin', 'tour-guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protectRoutes,
    authController.restrict('admin', 'tour-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protectRoutes,
    authController.restrict('admin', 'tour-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protectRoutes,
    authController.restrict('admin', 'tour-guide'),
    tourController.deleteTour
  );

module.exports = router;