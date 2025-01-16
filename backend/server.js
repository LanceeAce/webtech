const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const User = require('./models/User'); // Import the User model
const Order = require('./models/Order'); // Assuming you have an Order model

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/yourdb')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Store MongoDB connection in app.locals
mongoose.connection.once('open', () => {
    app.locals.db = mongoose.connection.db; // Makes the MongoDB connection available to all routes
    console.log('MongoDB connection is ready for use');
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// User login endpoint (using username only)
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body; // Expecting username and password

    // Check if username or password are missing
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username }); // Find user by username
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', username: user.username });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Order (Buy Now) endpoint
app.post('/api/orders', (req, res) => {
    const { username, items, totalPrice } = req.body;

    const newOrder = new Order({
        username,
        items,
        totalPrice
    });

    newOrder.save()
        .then(order => {
            res.json({ success: true, order });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: 'Error placing order' });
        });
});

// Get all orders (for admin view, if needed)
app.get('/api/orders', (req, res) => {
    Order.find()
        .then(orders => {
            res.json({ success: true, orders });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: 'Error fetching orders' });
        });
});





// Use admin routes
app.use('/admin', adminRoutes);

// Start server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
