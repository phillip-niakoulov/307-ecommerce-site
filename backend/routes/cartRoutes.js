const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
const ah = require('../AuthHandler');

const idValid = mongoose.Types.ObjectId.isValid;

const router = express.Router();

router.get('/', async (req, res) => {
    const auth = await ah(req.headers['authorization'], 'get_cart', null);

    if (!auth[1]) {
        return res.status(400).json({ message: 'User not specified' });
    }

    if (auth[0] === 401) {
        res.status(401).json(auth[1]);
    }

    if (!idValid(auth[1])) {
        return res.status(400).json('Invalid id');
    }
    const user = await User.findById(auth[1]);

    if (!user._id) {
        return res.status(404).json('User not found');
    }
    if (!user.cart) {
        return res.status(200).send({ products: [] });
    }

    Cart.findById(user.cart)
        .then((cart) => {
            if (!cart) {
                return res.status(404).send('Cart not found');
            }
            return res.status(200).json(cart['products']);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.put('/', async (req, res) => {
    const auth = await ah(req.headers['authorization'], 'add_cart', null);

    if (auth[0] === 401) {
        return res.status(401).json(auth[1]);
    }

    const product = req.body['product'];
    const count = req.body['count'];
    if (!auth[1]) {
        return res.status(400).json('No User Id');
    }

    if (!idValid(auth[1])) {
        return res.status(400).json('Invalid User Id');
    }

    if (!product)
        return res.status(400).json({ message: 'Product not specified' });
    if (count === undefined)
        return res.status(400).json({ message: 'Count not specified' });

    const user = await User.findById(auth[1]);

    if (!user) {
        return res.status(404).json('User not found');
    }
    if (user.cart === 'null') {
        const cart = new Cart({
            products: [],
            owner: user._id,
        });
        await cart.save();

        user.cart = cart._id;

        await User.findByIdAndUpdate(user._id, { cart: cart._id });
    }

    const prod = await Product.findById(product);
    if (prod === null || prod === undefined)
        return res.status(404).send('Product not found');
    const cart = await Cart.findById(user.cart);
    if (!cart) return res.status(404).send('Cart not found');

    const prodlist = cart['products'].filter((el) => {
        return el['id'] !== prod._id;
    });

    if (count > 0) {
        prodlist.push({ id: prod._id, count: count });
    }
    res.status(201).send(
        await Cart.findByIdAndUpdate(cart._id, { products: prodlist })
    );
});

router.delete('/', async (req, res) => {
    const auth = await ah(req.headers['authorization'], 'drop_cart', null);

    if (auth[0] === 401) {
        return res.status(401).json(auth[1]);
    }

    if (!auth[1]) {
        return res.status(400).json('User not specified');
    }
    if (!idValid(auth[1])) {
        return res.status(400).json('Invalid id');
    }

    const user = await User.findById(auth[1]);

    if (!user) {
        return res.status(404).json('User not found');
    }
    const cart = await Cart.findById(user.cart);

    if (!cart) return res.status(404).send('Cart not found');

    await Cart.findByIdAndUpdate(cart._id, { products: [] });

    res.status(200);
});
module.exports = router;
