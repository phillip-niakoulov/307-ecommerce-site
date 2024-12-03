const express = require('express');
const mongoose = require('mongoose');
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
        try {
            const users = await User.find().select('-password'); // Exclude password from response
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

router.get(
    '/:id',
    authenticateJWT,
    async (req, res, next) => {
        let func = () => {};
        if (req.params.id !== req.id) {
            func = authenticatePermissions('get-users');
        } else {
            func = async (req, res, next) => {
                next();
            };
        }
        func(req, res, next);
    },
    async (req, res) => {
        const id = req.params.id;

        if (!isValidObjectId(id)) {
            return res.status(404).json('Bad ID');
        }
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json('User not found');
        }

        return res.status(200).json({ user });
    }
);

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
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
        });

        const savedUser = await user.save();
        res.status(201).json({
            message: 'User registered successfully',
            userId: savedUser._id,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Register admin
// Remove authenticateJWT if you don't have an admin account
router.post(
    '/register-admin',
    authenticateJWT,
    authenticatePermissions('register-admin'),
    async (req, res) => {
        const { username, password } = req.body;

        try {
            // Check for dupes
            if (await User.findOne({ username: username })) {
                return res
                    .status(409)
                    .json('A user with this username already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                username,
                password: hashedPassword,
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

            const savedUser = await user.save();
            res.status(201).json({
                message: 'User registered successfully',
                userId: savedUser._id,
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
);

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });
        if (!user) return res.status(403).json({ message: 'Invalid username' });
        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(403).json({ message: 'Invalid password' });

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
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user details by ID
router.get(
    '/:id',
    authenticateJWT,
    authenticatePermissions('get-users'),
    async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        try {
            const user = await User.findById(req.params.id).select('-password'); // Exclude password from response
            if (!user)
                return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// Update user details
router.put(
    '/:id',
    authenticateJWT,
    authenticatePermissions('manage-permissions'),
    async (req, res) => {
        const { permissions } = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { permissions },
                { new: true }
            ).select('-password'); // Exclude password from response

            if (!updatedUser)
                return res.status(404).json({ message: 'User not found' });
            res.json(updatedUser);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
);

// Delete a user
router.delete(
    '/:id',
    authenticateJWT,
    authenticatePermissions('delete-users'),
    async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser)
                return res.status(404).json({ message: 'User not found' });
            res.json({ message: 'User deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

router.post('/checkout', authenticateJWT, async (req, res) => {
    try {
        const { cart } = req.body;
        const user = await User.findById(req.id);
        console.log(user);
        const order = new Order({
            owner: req.id,
            username: user.username,
            cart,
        });

        const saved = await order.save();
        return res.status(200).json(saved);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;
