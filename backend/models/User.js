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
        'delete-users': {
            type: Boolean,
            default: false,
        },
        'manage-permissions': {
            type: Boolean,
            default: false,
        },
        'view-orders': {
            type: Boolean,
            default: false,
        },
        // Add more permissions as needed
        // if you add new perms, update /register-admin in userRoutes.js to include it
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    settings: {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
