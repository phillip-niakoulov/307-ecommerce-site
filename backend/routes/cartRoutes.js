const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (req, res) => {
    Cart.find()
        .then((carts) => {
            res.status(200).json(carts);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});
router.get('/:id', (req, res) => {
    Cart.findById(req.params.id)
        .then((cart) => {
            res.status(200).json(cart);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.put('/:id', async (req, res) => {
    const product = req.body;
    if (!product)
        return res.status(500).json({ message: 'Product not specified' });
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    const cart = Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(new Cart(cart));
});

router.post('/create', async (req, res) => {
    if (!req.body.owner) {
        return res.status(500).json({ message: 'No owner specified' });
    }
    const owner = req.body.owner;
    if (!owner) {
        return res.status(501).json({ message: 'No User ID Specified' });
    }
    User.findById(owner)
        .then(async (user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user['cart'] !== 'null') {
                const existing = await Cart.findById(user['cart'])
                if (existing) {
                    return res.status(200).json(existing);
                }
            }
            const cart = new Cart();
            cart._id = new mongoose.Types.ObjectId()
            cart.owner = user._id;
            cart._id = new mongoose.Types.ObjectId();

            await cart.save()
            await User.findByIdAndUpdate(user['_id'], { cart: cart['_id']});

            return res.status(201).json(cart);
            }).catch((err) => {
               return res.status(500).send(err)
            })

        .catch((err) => {
            console.log(err)
            return res.status(500).send(err);
        });
});
module.exports = router;
