const User = require('../models/userModel'); // MongoDB model or relational DB query logic

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Or your custom query
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Controller to fetch a user by ID
exports.getUserById = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);  // Finding user by ID
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Update user info
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    // Other user properties you wish to update

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle block status of user
// Toggle block status of user
// In adminController.js
exports.toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.isBlocked = !user.isBlocked;  // Toggle block status
        await user.save();

        res.json({ success: true, message: user.isBlocked ? 'Blocked successfully' : 'Unblocked successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
};

  
  

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
