const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ah = require('../AuthHandler');
require('dotenv').config();

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check for dupes
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });
        if (existingEmail || existingUser) {
            return res
                .status(409)
                .json({ message: 'Username or email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user',
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

// Register admin (REMOVE ASAP, THINK OF BETTER WAY OF DOING THIS)
router.post('/register-admin', async (req, res) => {
    const { username, email, password } = req.body;

    const auth = await ah(req.headers['authorization'], 'new_admin', null);

    if (auth[0] === 401) {
        return res.status(401).json(auth[1]);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (User.findOne({ username: username })._id) {
            return res
                .status(409)
                .json('A user with this username already exists');
        }
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: 'admin',
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
            { userId: user._id },
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
router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password from response
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user details
router.put('/:id', async (req, res) => {
    const { username, email, firstName, lastName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, firstName, lastName },
            { new: true }
        ).select('-password'); // Exclude password from response

        if (!updatedUser)
            return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
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
});

module.exports = router;
