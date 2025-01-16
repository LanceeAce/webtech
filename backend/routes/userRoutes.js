const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// Get all users
router.get('/', userController.getAllUsers);

// Get a specific user by ID
router.get('/:id', userController.getUserById);  // Route para kunin ang user details by ID


// Edit a user
router.put('/:id', userController.updateUser);

// Block/Unblock a user
router.put('/block/:id', adminController.toggleBlockUser);

// Delete a user
router.delete('/:id', userController.deleteUser);


module.exports = router;
