const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');

const Fuse = require('fuse.js');
const path = require('path');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const authenticateJWT = require('../authMiddleware');
const authenticatePermissions = require('../permissionMiddleware');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 512 * 1024 * 1024 }, // Limit file size to 512MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(
            'Error: File upload only supports the following filetypes - ' +
                filetypes
        );
    },
});

const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient('images');

// Create a new product with image upload
router.post(
    '/create',
    authenticateJWT,
    authenticatePermissions('create-product'),
    upload.array('images', 10),
    async (req, res) => {
        const { name, originalPrice, description, category } = req.body;

        const requiredFields = [
            'name',
            'originalPrice',
            'description',
            'category',
        ];

        const missingFields = requiredFields.filter(
            (field) => !req.body[field]
        );

        // If there are any missing fields, return a 400 error with the list of missing fields
        if (missingFields.length > 0) {
            return res
                .status(400)
                .json({ message: 'Missing required fields', missingFields });
        }

        // Converts "   This Is An Item   " to "this-is-an-item"
        let id = name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/(^-+)|(-+$)/g, '');

        const product = new Product({
            _id: id,
            name: name,
            originalPrice: originalPrice,
            description: description,
            imageUrls: [],
            category: category,
        });

        try {
            // Check for dupes
            const existingName = await Product.findOne({ name });
            if (existingName) {
                return res
                    .status(409)
                    .json({ message: 'Name is already in use' });
            }

            const existingProduct = await Product.findById(id);
            if (existingProduct) {
                return res
                    .status(409)
                    .json({ message: 'Product with this ID already exists' });
            }

            if (req.files) {
                for (const file of req.files) {
                    const timestamp = Date.now();
                    const fileExtension = path.extname(file.originalname);
                    const blockBlobClient = containerClient.getBlockBlobClient(
                        `${id}-${timestamp}${fileExtension}`
                    );

                    // Upload the file buffer to Azure Blob Storage
                    await blockBlobClient.upload(file.buffer, file.size);
                    product.imageUrls.push(blockBlobClient.url); // Store the URL of the uploaded file
                }
            }

            const savedProduct = await product.save();
            res.status(201).json(savedProduct);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// Search
router.get('/search', async (req, res) => {
    const { query, sortField = 'name', sortOrder = 'asc' } = req.query;

    try {
        const products = await Product.find();

        let results = products;
        if (query) {
            const options = {
                keys: ['name', 'description'],
                threshold: 0.3, // Adjust threshold for fuzziness (0.0 - exact match, 1.0 - no match)
            };

            const fuse = new Fuse(products, options);
            const fuseResults = fuse.search(query);
            results = fuseResults.map((result) => result.item);
        }

        results.sort((a, b) => {
            let comparison = 0;

            if (sortField === 'price') {
                comparison = a.originalPrice - b.originalPrice;
            } else {
                comparison = a.name.localeCompare(b.name);
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Get a product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put(
    `/:id`,
    authenticateJWT,
    authenticatePermissions('update-product'),
    upload.array('images', 10),
    async (req, res) => {
        try {
            const { name, originalPrice, description, category } = req.body;
            const id = req.params.id;
            const body = {
                name,
                originalPrice,
                description,
                category,
            };

            if (req.files) {
                await clearFiles(id);
                body['imageUrls'] = await uploadFiles(req.files, id);
            }

            const prod = await Product.findByIdAndUpdate(id, body, {
                new: true,
            });
            if (!prod) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(prod);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
    }
);

async function clearFiles(id) {
    const product = await Product.findById(id);

    for (const imageUrl of product.imageUrls) {
        const blobName = imageUrl.split('/').pop();
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.deleteIfExists();
    }
}

async function uploadFiles(files, id) {
    const imageUrls = [];
    for (const file of files) {
        const timestamp = Date.now();
        const fileExtension = path.extname(file.originalname);
        const blockBlobClient = containerClient.getBlockBlobClient(
            `${id}-${timestamp}${fileExtension}`
        );

        // Upload the file buffer to Azure Blob Storage
        await blockBlobClient.upload(file.buffer, file.size);
        imageUrls.push(blockBlobClient.url);
    }
    return imageUrls;
}
// Delete a product
router.delete(
    '/:id',
    authenticateJWT,
    authenticatePermissions('delete-product'),
    async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            await clearFiles(req.params.id);

            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Product deleted' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    }
);

// get the highest-selling product
router.get('/highest-selling-item', async (req, res) => {
    try {
        const sales = await Order.aggregate([
            { $unwind: '$cart' },
            {
                $group: {
                    _id: '$cart.itemId', 
                    totalSold: { $sum: '$cart.quantity' },
                },
            },
            { $sort: { totalSold: -1 } }, 
            { $limit: 1 }, 
        ]);

        if (sales.length === 0) {
            return res.status(404).json({ message: 'No sales data available' });
        }

        const topProductId = sales[0]._id;
        const totalSold = sales[0].totalSold;

        const topProduct = await Product.findById(topProductId);
        if (!topProduct) {
            return res
                .status(404)
                .json({ message: 'Top-selling product not found' });
        }

        res.status(200).json({
            id: topProduct._id,
            name: topProduct.name,
            totalSold,
            imageUrls: topProduct.imageUrls,
            description: topProduct.description,
            category: topProduct.category,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
