var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller.js');
const authController = require('../controllers/auth.controller.js');

router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Welcome to the share-a-meal API database"
  });
});

//Post (Register) an user if email isnt already taken.
router.post('/api/user', userController.ValidateUser, userController.addUser);

//Get all users if logged in.
router.get('/api/user', authController.validateToken, userController.getAllUsers)

//Get your user profile.
router.get('/api/user/profile', authController.validateToken, userController.getUserProfile);

//Get specific user by id if logged in.
router.get('/api/user/:userId', authController.validateToken, userController.getUserById);

//Delete my user if logged in.
router.delete('/api/user/:userId', authController.validateToken, userController.deleteUser);

//Update specific user by id if logged in.
router.put('/api/user/:userId', authController.validateToken, userController.ValidateUser, userController.updateUser);

module.exports = router;