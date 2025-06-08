const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const router = express.Router({ mergeParams: true });

// POST tours/4546547ddsy/reviews
// reviews/
router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)

router
    .route('/:id')
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview)

module.exports = router;