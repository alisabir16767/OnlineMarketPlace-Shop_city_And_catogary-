const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// Route to create new user
router.post('/', userController.createUsers);

// Route to get all users
router.get('/', userController.getAllUsers);

// Route to retrieve a particular user
router.get('/:userId', userController.getUserById);

// Route to update existing user data
router.put('/:userId',userController.updateUser);

// delete the existing user data
router.delete('/:userId', userController.deleteUser);


module.exports = router;
