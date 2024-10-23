const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrls: {
    // Array to store multiple image paths
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: {
    // Optional
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
