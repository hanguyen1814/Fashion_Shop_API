const Product = require("../models/product.model");

const getAllProducts = async (req, res) => {
  try {
    const { offset = 0, limit = 10 } = req.query;
    const products = await Product.getAllProducts(
      parseInt(offset),
      parseInt(limit)
    );
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { offset = 0, limit = 10 } = req.query;
    const products = await Product.getProductsByCategory(
      parseInt(categoryId),
      parseInt(offset),
      parseInt(limit)
    );
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productId = await Product.createProduct(req.body);
    res
      .status(201)
      .json({ message: "Product created successfully", product_id: productId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Product.updateProduct(id, req.body);
    if (affectedRows === 0)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Product.deleteProduct(id);
    if (affectedRows === 0)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
