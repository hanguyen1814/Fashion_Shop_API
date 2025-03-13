const Product = require("../models/product.model");
const Category = require("../models/category.model");

const productController = {
  getAllProducts: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
      const products = await Product.getAll(parseInt(page), parseInt(limit));
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getProductsByCategory: async (req, res) => {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const catInfo = await Category.getById(category);

    try {
      const products = await Product.getByCatId(
        category,
        parseInt(page),
        parseInt(limit)
      );
      res.status(200).json({ category: catInfo.cat_tree, products });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.getById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      const cat_id = product.category_id;
      const category = await Category.getById(cat_id);
      res.status(200).json({ category: category.cat_tree, product });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  createProduct: async (req, res) => {
    const newProduct = req.body;
    try {
      const createdProduct = await Product.create(newProduct);
      if (!createdProduct.status) {
        return res.status(400).json({ error: createdProduct.error });
      }
      res.status(201).json(createdProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    try {
      const result = await Product.update(id, updatedProduct);
      if (!result.status) {
        return res.status(400).json({ error: result.error });
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Product.delete(id);
      if (!result.status) {
        return res.status(400).json({ error: result.error });
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = productController;
