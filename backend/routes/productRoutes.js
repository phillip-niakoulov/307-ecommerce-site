const express = require('express');
const Product = require('../models/Product');
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
    const { query, sortField = 'name', sortOrder = 'asc' } = req.query; // Default values

    try {
        // Fetch all products from the database
        const products = await Product.find();

        // If a query is provided, perform fuzzy search
        let results = products;
        if (query) {
            const options = {
                keys: ['name', 'description'],
                threshold: 0.3, // Adjust threshold for fuzziness (0.0 - exact match, 1.0 - no match)
            };

            const fuse = new Fuse(products, options);
            const fuseResults = fuse.search(query);
            results = fuseResults.map((result) => result.item); // Get the matched items
        }

        // Sort the results based on sortField and sortOrder
        results.sort((a, b) => {
            let comparison = 0;

            if (sortField === 'price') {
                comparison = a.originalPrice - b.originalPrice; // Assuming originalPrice is a number
            } else {
                // Default to sorting by name
                comparison = a.name.localeCompare(b.name);
            }

            return sortOrder === 'asc' ? comparison : -comparison; // Reverse comparison for descending order
        });

        // Return the sorted results
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
    async (req, res) => {
        try {
            const { name, originalPrice, description, category } = req.body;
            const prod = await Product.findByIdAndUpdate(req.params.id, {
                name,
                originalPrice,
                description,
                category,
            });
            if (!prod) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(201).json(prod);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
    }
);

// Delete a product
router.delete(
    '/:id',
    authenticateJWT,
    authenticatePermissions('delete-product'),
    async (req, res) => {
        try {
            // Find the product by ID
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            for (const imageUrl of product.imageUrls) {
                const blobName = imageUrl.split('/').pop();
                const blockBlobClient =
                    containerClient.getBlockBlobClient(blobName);

                await blockBlobClient.deleteIfExists();
            }

            // Delete the product from the database
            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Product deleted' });
        } catch (err) {
            console.error(err); // Log the error for debugging
            res.status(500).json({ message: err.message });
        }
    }
);

module.exports = router;
