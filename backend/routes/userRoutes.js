const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

//Update Later
const secret_key =
    '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';

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

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

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
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(403).json({ message: 'Invalid email' });
        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(403).json({ message: 'Invalid password' });

        const token = await jwt.sign({ userId: user._id }, secret_key, {
            expiresIn: '1h',
        });

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
