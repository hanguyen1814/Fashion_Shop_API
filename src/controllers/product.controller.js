const Product = require("../models/product.model");
const Category = require("../models/category.model");

const removeDiacritics = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

const productController = {
  getAllProducts: async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    try {
      const products = await Product.getAll(parseInt(page), parseInt(limit));
      res.status(200).json({ status: true, data: products });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },
  getProductsByCategory: async (req, res) => {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const catInfo = await Category.getById(category);

    try {
      const products = await Product.getByCatId(
        category,
        parseInt(page),
        parseInt(limit)
      );
      res
        .status(200)
        .json({ status: true, data: { category: catInfo.cat_tree, products } });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },
  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.getById(id);
      if (!product) {
        return res
          .status(404)
          .json({ status: false, error: "Product not found" });
      }
      const cat_id = product.category_id;
      const category = await Category.getById(cat_id);
      res
        .status(200)
        .json({ status: true, data: { category: category.cat_tree, product } });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },
  createProduct: async (req, res) => {
    const newProduct = req.body;
    try {
      const createdProduct = await Product.create(newProduct);
      if (!createdProduct.status) {
        return res
          .status(400)
          .json({ status: false, error: createdProduct.error });
      }
      res.status(201).json({ status: true, data: createdProduct });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    try {
      const result = await Product.update(id, updatedProduct);
      if (!result.status) {
        return res.status(400).json({ status: false, error: result.error });
      }
      res.status(200).json({ status: true, data: result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Product.delete(id);
      if (!result.status) {
        return res.status(400).json({ status: false, error: result.error });
      }
      res.status(200).json({ status: true, data: result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },
  searchProductsByName: async (req, res) => {
    const { name, page = 1, limit = 20 } = req.query;
    if (!name) {
      return res
        .status(400)
        .json({ status: false, error: "Name query is required" });
    }

    try {
      const normalizedName = removeDiacritics(name);
      const products = await Product.searchByName(
        normalizedName,
        parseInt(page),
        parseInt(limit)
      );
      res.status(200).json({ status: true, data: products });
    } catch (err) {
      console.error("Error searching products by name:", err);
      res.status(500).json({ status: false, error: err.message });
    }
  },

  searchProductsByColor: async (req, res) => {
    const { color, page = 1, limit = 20 } = req.query;
    if (!color) {
      return res
        .status(400)
        .json({ status: false, error: "Color query is required" });
    }

    try {
      const normalizedColor = removeDiacritics(color);
      const products = await Product.searchByColor(
        normalizedColor,
        parseInt(page),
        parseInt(limit)
      );
      res.status(200).json({ status: true, data: products });
    } catch (err) {
      console.error("Error searching products by color:", err);
      res.status(500).json({ status: false, error: err.message });
    }
  },
  searchProductsBySize: async (req, res) => {
    const { size, page = 1, limit = 20 } = req.query;
    if (!size) {
      return res
        .status(400)
        .json({ status: false, error: "Size query is required" });
    }

    try {
      const normalizedSize = removeDiacritics(size);
      const products = await Product.searchBySize(
        normalizedSize,
        parseInt(page),
        parseInt(limit)
      );
      res.status(200).json({ status: true, data: products });
    } catch (err) {
      console.error("Error searching products by size:", err);
      res.status(500).json({ status: false, error: err.message });
    }
  },

  searchProductsByPrice: async (req, res) => {
    const { min = 0, max = 100000000, page = 1, limit = 20 } = req.query;
    if (!min || !max) {
      return res.status(400).json({
        status: false,
        error: "Min and Max price queries are required",
      });
    }

    try {
      const products = await Product.searchByPrice(
        parseFloat(min),
        parseFloat(max),
        parseInt(page),
        parseInt(limit)
      );
      res.status(200).json({ status: true, data: products });
    } catch (err) {
      console.error("Error searching products by price:", err);
      res.status(500).json({ status: false, error: err.message });
    }
  },
};

module.exports = productController;
