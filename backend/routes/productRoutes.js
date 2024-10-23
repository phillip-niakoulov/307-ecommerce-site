const express = require("express");
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // store images in "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

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
      "Error: File upload only supports the following filetypes - " + filetypes
    );
  },
});

// FRONTEND INTEGRATION MAYBE WILL BE TRICKY
// Create a new product with image upload
router.post("/create", upload.array("images", 10), async (req, res) => {
  // 10 images max

  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  }
  if (!req.files) {
    return res.status(400).json({ message: "No images were uploaded" });
  }

  const { name, originalPrice, description, category, tags } = req.body;

  // Validate required fields
  if (
    !name ||
    !originalPrice ||
    !description ||
    !req.files.length ||
    !category
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Converts "This Is An Item" to "this-is-an-item"
  id = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");

  const sanitizedFilenames = req.files.map((file) => {
    const sanitizedFilename =
      Date.now() + "-" + file.originalname.replace(/[^a-z0-9.]/gi, "_");
    return sanitizedFilename;
  });
  const imageUrls = sanitizedFilenames.map(
    (filename) => `/uploads/${filename}`
  );

  const product = new Product({
    _id: id,
    name: name,
    originalPrice: originalPrice,
    description: description,
    imageUrls: imageUrls,
    category: category,
    tags: tags,
  });

  try {
    // Check for dupes
    const existingName = await Product.findOne({ name });
    if (existingName) {
      return res.status(409).json({ message: "Name is already in use" });
    }

    const existingProduct = await Product.findById(id);
    if (existingProduct) {
      return res
        .status(409)
        .json({ message: "Product with this ID already exists" });
    }

    // Rename already uploaded files to sanitized filenames
    await Promise.all(
      req.files.map((file, index) => {
        const newFilename = sanitizedFilenames[index];
        return fs.promises.rename(
          path.join("uploads", file.filename),
          path.join("uploads", newFilename)
        );
      })
    );

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a product
// FRONTEND INTEGRATION WILL ALSO BE TRICKY
// (ie adding just an image, keep the old ones temporarily and add the new ones?)
// My solution will replace all images but it will delete the old ones so we have
// to think of a way to specify which files should only be deleted
router.put("/:id", upload.array("images", 10), async (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  }
  if (!req.files) {
    return res.status(400).json({ message: "No images were uploaded" });
  }

  const { name, originalPrice, description, category, tags } = req.body;

  // Validate required fields
  if (
    !name ||
    !originalPrice ||
    !description ||
    !req.files.length ||
    !category
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Delete the old entry
  const existingProduct = await Product.findById(req.params.id); // If old ID isn't found
  if (!existingProduct) {
    return res.status(404).json({ message: "Product not found" });
  }
  // Remove all old image files
  await Promise.all(
    existingProduct.imageUrls.map(async (url) => {
      const filePath = path.join(__dirname, "..", url); // Adjust the path as necessary
      try {
        await fs.promises.unlink(filePath); // Delete the file
      } catch (fileErr) {
        console.error(`Error deleting file ${filePath}:`, fileErr);
      }
    })
  );
  await Product.findByIdAndDelete(req.params.id);

  // Converts "This Is An Item" to "this-is-an-item"
  id = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");

  const sanitizedFilenames = req.files.map((file) => {
    const sanitizedFilename =
      Date.now() + "-" + file.originalname.replace(/[^a-z0-9.]/gi, "_");
    return sanitizedFilename;
  });
  const imageUrls = sanitizedFilenames.map(
    (filename) => `/uploads/${filename}`
  );

  // MUST CREATE NEW SINCE DIFFERENT ID
  const product = new Product({
    _id: id,
    name: name,
    originalPrice: originalPrice,
    description: description,
    imageUrls: imageUrls,
    category: category,
    tags: tags,
  });

  try {
    // Check for dupes
    const existingName = await Product.findOne({ name }); // If new name is already in use
    if (existingName) {
      return res.status(409).json({ message: "Name is already in use" });
    }

    const existingProduct = await Product.findById(id); // If new ID is already in use
    if (existingProduct) {
      return res
        .status(409)
        .json({ message: "Product with this ID already exists" });
    }

    // Rename already uploaded files to sanitized filenames
    await Promise.all(
      req.files.map((file, index) => {
        const newFilename = sanitizedFilenames[index];
        return fs.promises.rename(
          path.join("uploads", file.filename),
          path.join("uploads", newFilename)
        );
      })
    );

    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove associated image files
    const imageUrls = product.imageUrls; // Assuming imageUrls contains the paths to the images
    await Promise.all(
      imageUrls.map(async (url) => {
        const filePath = path.join(__dirname, "..", url); // Adjust the path as necessary
        try {
          await fs.promises.unlink(filePath); // Delete the file
        } catch (fileErr) {
          console.error(`Error deleting file ${filePath}:`, fileErr);
        }
      })
    );

    // Delete the product from the database
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
