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
    '/user/:id',
    authenticateJWT,
    async (req, res, next) => {
        let func;
        if (req.params.id !== req.id) {
            func = authenticatePermissions('view-orders');
        } else {
            func = async (req, res, next) => {
                next();
            };
        }
        func(req, res, next);
    },
    async (req, res) => {
        try {
            const order = await Order.find({ owner: req.params.id }).sort({
                name: 1,
            });
            return res.status(200).json(order);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

router.get(
    '/:id',
    authenticateJWT,
    async (req, res, next) => {
        order = await Order.findById(req.params.id);

        if (!order || req.id !== order.owner.toString()) {
            return authenticatePermissions('view-orders')(req, res, next);
        }
        next();
    },
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

router.put(
    '/:id',
    authenticateJWT,
    authenticatePermissions('update-orders'),
    async (req, res) => {
        if (!req?.body?.['status']) {
            return res.status(401).json({ message: 'No status specified' });
        }
        const order = await Order.findByIdAndUpdate(req.params.id, {
            order_status: {
                status: req.body.status,
                updatedAt: Date.now(),
            },
        });
        if (!order) {
            return res.status(404).json({ message: 'Not found' });
        }
        await order.save();
        return res.status(201).json(order.toJSON());
    }
);

module.exports = router;
