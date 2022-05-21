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

//Post an user if email isnt already taken
router.post('/api/user', userController.ValidateUser, userController.addUser);

//Get a all users
router.get('/api/user', authController.validateToken, userController.getAllUsers)

//Get a user profile(endpoint not realised yet)
router.get('/api/user/profile', authController.validateToken, userController.getUserProfile);

//Get specific user by id
router.get('/api/user/:userId',userController.getUserById);

//Delete a user by id
router.delete('/api/user/:userId', userController.deleteUser);

//Update specific user by id
router.put('/api/user/:userId', userController.ValidateUser, userController.updateUser);

module.exports = router;