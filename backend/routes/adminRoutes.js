const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import the User model
// Import the middleware


// Admin login route
router.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
    const adminUsername = 'admin';
    const adminPassword = '123';

    if (username === adminUsername && password === adminPassword) {
        return res.status(200).json({ success: true, message: 'Admin login successful!' });
    } else {
        return res.status(400).json({ success: false, message: 'Invalid admin credentials' });
    }
});

// Route to get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Fetch users without returning passwords
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});

router.get('/users/username/:username', (req, res) => {
    const { username } = req.params;

    // Hanapin ang user gamit ang username
    User.findOne({ username: username }, (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    });
});

// Route to edit user details
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password, isBlocked } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update user details
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10); // Hash new password
        if (typeof isBlocked !== 'undefined') user.isBlocked = isBlocked;

        await user.save();
        res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
});



// Route to block a user
router.put('/users/block/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isBlocked = true;  // Block user
        await user.save();
        res.status(200).json({ success: true, message: 'User blocked successfully' });
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ success: false, message: 'Error blocking user' });
    }
});

// Route to unblock a user
router.put('/users/unblock/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isBlocked = false;  // Unblock user
        await user.save();
        res.status(200).json({ success: true, message: 'User unblocked successfully' });
    } catch (error) {
        console.error('Error unblocking user:', error);
        res.status(500).json({ success: false, message: 'Error unblocking user' });
    }
});

// Example: Check if user is blocked before allowing cart actions
router.post('/cart', async (req, res) => {
    const { userId, itemId } = req.body;
    const user = await User.findById(userId);

    if (user && user.isBlocked) {
        return res.status(400).json({ success: false, message: 'You are blocked from making purchases' });
    }
    
    // Proceed to add the item to the cart...
});


// Route to delete a user
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

          // Mark user as deleted by setting a flag
          user.isDeleted = true; // Set the user as deleted
          await user.save();

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
});

module.exports = router;
