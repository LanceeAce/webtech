const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false } // Para matukoy kung naka-block ang user
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
