const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Order = require('../models/Order');

const jwt = require('jsonwebtoken');
const authenticateJWT = require('../authMiddleware');
const authenticatePermissions = require('../permissionMiddleware');
const { isValidObjectId } = require('mongoose');

require('dotenv').config();

const router = express.Router();

// List all users
router.get(
    '/',
    authenticateJWT,
    authenticatePermissions('get-users'),
    async (req, res) => {
        const users = await User.find().select('-password'); // Exclude password from response
        res.status(200).json(users);
    }
);

// Get user details by ID
router.get(
    '/:id',
    authenticateJWT,
    async (req, res, next) => {
        if (req.params.id !== req.id) {
            return authenticatePermissions('get-users')(req, res, next);
        }
        next();
    },
    async (req, res) => {
        const id = req.params.id;

        if (!isValidObjectId(id)) {
            return res.status(404).json({ message: 'Bad ID' });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const foundUser = await User.findById(id).select('-password');

        return res.status(200).json(foundUser);
    }
);

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Check for dupes
    if (await User.findOne({ username })) {
        return res
            .status(409)
            .json({ message: 'Username or email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword,
        email: email,
    });

    const savedUser = await user.save();
    res.status(201).json({
        message: 'User registered successfully',
        userId: savedUser._id,
    });
});

// Register admin
// Remove authenticateJWT if you don't have an admin account
router.post(
    '/register-admin',
    authenticateJWT,
    authenticatePermissions('register-admin'),
    async (req, res) => {
        const { username, password, email } = req.body;
        // Check for dupes
        if (await User.findOne({ username: username })) {
            return res
                .status(409)
                .json({ message: 'A user with this username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            email: email,
            permissions: {
                'create-product': true,
                'update-product': true,
                'delete-product': true,
                'get-users': true,
                'register-admin': true,
                'update-users': true,
                'delete-users': true,
                'manage-permissions': true,
                'view-orders': true,
                'update-orders': true,
            },
        });
        try {
            const savedUser = await user.save();
            res.status(201).json({
                message: 'User registered successfully',
                userId: savedUser._id,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }

    }
);

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) return res.status(403).json({ message: 'Invalid username' });
    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ message: 'Invalid password' });

    const token = await jwt.sign(
        {
            userId: user._id,
            username: user.username,
            permissions: user.permissions,
        },
        process.env.JWT_KEY,
        {
            expiresIn: '1h',
        }
    );

    res.status(200).json({ token });
});

// Update user details
router.put(
    '/:id',
    authenticateJWT,
    authenticatePermissions('manage-permissions'),
    async (req, res) => {
        const { permissions } = req.body;

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { permissions },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = await updatedUser.select('-password'); // Exclude password from response
        res.status(200).json(user);
    }
);

// Delete a user
router.delete(
    '/:id',
    authenticateJWT,
    async (req, res, next) => {
        let func;
        if (req.params.id !== req.id) {
            func = authenticatePermissions('delete-users');
        } else {
            func = async (req, res, next) => {
                next();
            };
        }
        func(req, res, next);
    },
    async (req, res) => {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser)
            return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    }
);

router.post('/checkout', authenticateJWT, async (req, res) => {

    const { cart } = req.body;

    const order = new Order({
        owner: req.id,
        cart,
    });

    const saved = await order.save();
    return res.status(200).json(saved);
});

module.exports = router;
