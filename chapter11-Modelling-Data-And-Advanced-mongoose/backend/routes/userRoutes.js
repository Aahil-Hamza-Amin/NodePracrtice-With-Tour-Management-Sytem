const express = require('express');
const userController = require('./../controllers/userControllers');

const router = express.Router();

router.post('/signUp', userController.signUp);

module.exports = router;