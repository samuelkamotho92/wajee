const express = require('express');
const reviewController = require('../controller/reviews');
const authController = require('../controller/authcontroler');

const router = express.Router({ mergeParams: true });

router.use(authController.protectRoutes);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrict('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrict('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;