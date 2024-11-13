const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [
        {
            id: {
                type: String,
                required: true,
            },
            count: {
                type: Number,
                required: true,
            },
        },
    ],
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
