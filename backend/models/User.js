const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Extra
    firstName: String,
    lastName: String,
    defaultAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },
    phone: String,
    cart: {
        type: String,
        required: true,
        default: 'null',
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
