const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    permissions: {
        // if you add new perms, update /register-admin in userRoutes.js to include it
        'create-product': {
            type: Boolean,
            default: false,
        },
        'update-product': {
            type: Boolean,
            default: false,
        },
        'delete-product': {
            type: Boolean,
            default: false,
        },
        'get-users': {
            type: Boolean,
            default: false,
        },
        'register-admin': {
            type: Boolean,
            default: false,
        },
        'update-users': {
            type: Boolean,
            default: false,
        },
        'delete-users': {
            type: Boolean,
            default: false,
        },
        // Add more permissions as needed
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
