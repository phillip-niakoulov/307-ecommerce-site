const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    cart: [
        {
            itemId: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],

    order_status: {
        status: {
            type: String,
            default: 'active',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        fulfilledAt: {
            type: Date,
            default: 0,
        },
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
