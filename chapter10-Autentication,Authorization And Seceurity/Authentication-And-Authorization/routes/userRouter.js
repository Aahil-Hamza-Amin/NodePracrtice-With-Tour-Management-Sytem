const express = require('express');
const authController = require('../controller/authController');
const { route } = require('../app');

const router = express.Router();

router.post('/signUp', authController.signUp);

module.exports = router