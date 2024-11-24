const express = require('express');
const Product = require('../models/Product');
const Fuse = require('fuse.js');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
const authenticateJWT = require('../authMiddleware');
const authenticatePermissions = require('../permissionMiddleware');

const router = express.Router();

// const storagePath = '../frontend/src/assets'; // store images in "assets" directory

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, storagePath);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 512 * 1024 * 1024 }, // Limit file size to 512MB
//     fileFilter: (req, file, cb) => {
//         const filetypes = /jpeg|jpg|png|gif/;
//         const mimetype = filetypes.test(file.mimetype);
//         const extname = filetypes.test(
//             path.extname(file.originalname).toLowerCase()
//         );
//         if (mimetype && extname) {
//             return cb(null, true);
//         }
//         cb(
//             'Error: File upload only supports the following filetypes - ' +
//                 filetypes
//         );
//     },
// });

// Create a new product with image upload
router.post(
    '/create',
    authenticateJWT,
    authenticatePermissions('create-product'),
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

            const savedProduct = await product.save();
            res.status(201).json(savedProduct);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// Get all products
// UNUSED!
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ name: 1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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

// Update a product
// DOESNT WORK FOR NOW WHILE FINDING NEW WAY TO ADD IMAGES

// router.put(
//     '/:id',
//     authenticateJWT,
//     authenticatePermissions('update-product'),
//     upload.array('images', 10), // location might be an issue, think it has to be after verification to prevent users from spamming images w/o perms
//     async (req, res) => {
//         if (req.fileValidationError) {
//             return res.status(400).json({ message: req.fileValidationError });
//         }
//         if (!req.files) {
//             return res.status(400).json({ message: 'No images were uploaded' });
//         }

//         const { name, originalPrice, description, category, tags } = req.body;

//         // Validate required fields
//         if (
//             !name ||
//             !originalPrice ||
//             !description ||
//             !req.files.length ||
//             !category
//         ) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }

//         // Delete the old entry
//         const existingProduct = await Product.findById(req.params.id); // If old ID isn't found
//         if (!existingProduct) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         // Remove all old image files
//         await Promise.all(
//             existingProduct.imageUrls.map(async (url) => {
//                 const filePath = path.join(__dirname, '..', url); // Adjust the path as necessary
//                 try {
//                     await fs.promises.unlink(filePath); // Delete the file
//                 } catch (fileErr) {
//                     console.error(`Error deleting file ${filePath}:`, fileErr);
//                 }
//             })
//         );
//         await Product.findByIdAndDelete(req.params.id);

//         // Converts "This Is An Item" to "this-is-an-item"
//         const id = name
//             .toLowerCase()
//             .replace(/\s+/g, '-')
//             .replace(/[^a-z0-9-]/g, '')
//             .replace(/(^-+)|(-+$)/g, '');

//         const sanitizedFilenames = req.files.map((file) => {
//             return (
//                 Date.now() +
//                 '-' +
//                 file.originalname.replace(/[^a-z0-9.]/gi, '_')
//             );
//         });
//         const imageUrls = sanitizedFilenames.map((filename) =>
//             path.join(storagePath, filename)
//         );

//         // MUST CREATE NEW SINCE DIFFERENT ID
//         const product = new Product({
//             _id: id,
//             name: name,
//             originalPrice: originalPrice,
//             description: description,
//             imageUrls: imageUrls,
//             category: category,
//             tags: tags,
//         });

//         try {
//             // Check for dupes
//             const existingName = await Product.findOne({ name }); // If new name is already in use
//             if (existingName) {
//                 await Promise.all(
//                     req.files.map((file) => {
//                         return fs.promises.unlink(
//                             path.join(storagePath, file.filename)
//                         );
//                     })
//                 );
//                 return res
//                     .status(409)
//                     .json({ message: 'Name is already in use' });
//             }

//             const existingProduct = await Product.findById(id); // If new ID is already in use
//             if (existingProduct) {
//                 await Promise.all(
//                     req.files.map((file) => {
//                         return fs.promises.unlink(
//                             path.join(storagePath, file.filename)
//                         );
//                     })
//                 );
//                 return res
//                     .status(409)
//                     .json({ message: 'Product with this ID already exists' });
//             }

//             // Rename already uploaded files to sanitized filenames
//             await Promise.all(
//                 req.files.map((file, index) => {
//                     const newFilename = sanitizedFilenames[index];
//                     return fs.promises.rename(
//                         path.join(storagePath, file.filename),
//                         path.join(storagePath, newFilename)
//                     );
//                 })
//             );

//             const savedProduct = await product.save();
//             res.status(200).json(savedProduct);
//         } catch (err) {
//             await Promise.all(
//                 req.files.map((file) => {
//                     return fs.promises.unlink(
//                         path.join(storagePath, file.filename)
//                     );
//                 })
//             );
//             res.status(400).json({ message: err.message });
//         }
//     }
// );

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

            // // Remove associated image files
            // const imageUrls = product.imageUrls; // Assuming imageUrls contains the paths to the images
            // await Promise.all(
            //     imageUrls.map(async (url) => {
            //         const filePath = path.join(__dirname, '..', url); // Adjust the path as necessary
            //         try {
            //             await fs.promises.unlink(filePath); // Delete the file
            //         } catch (fileErr) {
            //             console.error(
            //                 `Error deleting file ${filePath}:`,
            //                 fileErr
            //             );
            //         }
            //     })
            // );

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
