const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: {
        type: [String],
        required: true,
        unique: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    owner: {
        type: String, // User id from user model.
        required: true,
    },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
