var express = require('express');
const authController = require('../controllers/auth.controller.js');
var router = express.Router();

router.post('/auth/login', authController.validate , authController.login)

module.exports = router;
