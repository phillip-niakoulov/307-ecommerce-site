const express = require('express');
const Order = require('../models/Order');
const authenticateJWT = require('../authMiddleware');
const authenticatePermissions = require('../permissionMiddleware');

const router = express.Router();

router.get(
    '/',
    authenticateJWT,
    authenticatePermissions('view-orders'),
    async (req, res) => {
        try {
            const order = await Order.find().sort({ name: 1 });
            return res.status(200).json(order);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

router.get(
    '/:id',
    authenticateJWT,
    authenticatePermissions('view-orders'),
    async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res
                    .status(404)
                    .json({ 'Order not found with this id': req.params.id });
            }
            return res.status(200).json(order);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
);

module.exports = router;