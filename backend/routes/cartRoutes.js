const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
const ah = require('../AuthHandler');

const idValid = mongoose.Types.ObjectId.isValid;

const router = express.Router();

router.get('/:id', (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Cart not specified' });
    }
    if (!idValid(req.params.id)) {
        return res.status(400).send('Invalid id');
    }
    Cart.findById(req.params.id)
        .then((cart) => {
            if (!cart) {
                return res.status(404).send('Cart not found');
            }
            return res.status(200).json(cart);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.put('/:id', async (req, res) => {
    const auth = await ah(req.headers['authorization'], 'new_admin', null);

    if (auth[0] === 401) {
        res.status(401).json(auth[1]);
    }
    const product = req.body['product'];
    if (!product)
        return res.status(400).send({ message: 'Product not specified' });

    if (!idValid(product)) {
        return res.status(400).send('Invalid product id');
    }

    const prod = await Product.findById(product);
    if (!prod) return res.status(404).send('Product not found');
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).send('Cart not found');
    console.log(cart);
    if (cart['products'].includes(prod._id)) {
        return res.status(200).send(cart);
    }
    cart['products'].push(prod._id);
    await Cart.findByIdAndUpdate(cart._id, { products: cart['products'] });
    res.status(201).send(cart);
});

router.post('/create', async (req, res) => {
    const auth = await ah(req.headers['authorization'], 'new_admin', null);

    if (auth[0] === 401) {
        return res.status(401).json(auth[1]);
    }

    if (!req.body.owner) {
        return res.status(400).json('No owner specified');
    }
    const owner = req.body.owner;
    if (!owner) {
        return res.status(400).json('No User ID Specified');
    }

    if (!idValid(owner)) {
        return res.status(400).json('Invalid owner id');
    }

    User.findById(owner)
        .then(async (user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user['cart'] !== 'null') {
                const existing = await Cart.findById(user['cart']);
                if (existing) {
                    return res.status(200).json(existing);
                }
            }
            const cart = new Cart();
            cart._id = new mongoose.Types.ObjectId();
            cart.owner = user._id;
            cart._id = new mongoose.Types.ObjectId();

            await cart.save();
            await User.findByIdAndUpdate(user['_id'], { cart: cart['_id'] });

            return res.status(201).json(cart);
        })
        .catch((err) => {
            return res.status(500).json(err);
        })

        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
});

router.delete('/:id', async (req, res) => {
    const auth = await ah(req.headers['authorization'], 'new_admin', null);

    if (auth[0] === 401) {
        return res.status(401).json(auth[1]);
    }

    if (!req.params.id) {
        return res.status(400).json('Cart not specified');
    }
    if (!idValid(req.params.id)) {
        return res.status(400).json('Invalid id');
    }
    if (req.body.product) {
        const cart = await Cart.findById(req.params.id);

        if (!cart || !cart['products'])
            return res.status(404).json('Cart not found');
        cart['products'] = cart['products'].filter((el) => {
            return el !== req.body.product;
        });
        await Cart.findByIdAndUpdate(req.params.id, {
            products: cart['products'],
        });
        return res.status(200).json(cart);
    }
    Cart.findByIdAndDelete(req.params.id)
        .then((cart) => {
            if (!cart) return res.status(404).send('Cart not found');
            return res.status(200).send('Deleted');
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
});
module.exports = router;
