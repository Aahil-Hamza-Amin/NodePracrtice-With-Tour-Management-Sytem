const express = require('express');
const userController = require('./../controllers/userController');

// ROUTERS 
const router = express.Router();

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

// ROUTES for USERS

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;