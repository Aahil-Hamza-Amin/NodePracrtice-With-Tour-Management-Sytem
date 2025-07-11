const express = require('express')
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController')

const router = express.Router();

// PARAM MIDDLEWARE

// router.param('id', (req, res, next, val) => {
//     console.log(`Tour id is: ${val}`);
//     next();
// })

// router.param('id', tourController.checkID)

router.route('/top-5-cheap').get(tourController.aliasTopTour, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour)
// .post(tourController.checkBody, tourController.createTour)

router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour)

module.exports = router;