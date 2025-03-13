const Category = require("../models/category.model");
const Product = require("../models/product.model");

const CategoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.getAllCat();
      for (const category of categories) {
        const products = await Product.getByCatId(category.id);
        category.products = products;
      }
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getCategoryById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Category.getById(id);
      if (!result)
        return res.status(404).json({ message: "Category not found" });
      const products = await Product.getByCatId(id, 1, 10);
      result.products = products;
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getCategoryBySlug: async (req, res) => {
    const { slug } = req.params;
    try {
      const result = await Category.getBySlug(slug);
      if (!result)
        return res.status(404).json({ message: "Category not found" });
      const products = await Product.getByCatId(result.id);
      result.products = products;
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createCategory: async (req, res) => {
    const { name, slug, description, parent_id, brand_id, status, image } =
      req.body;
    try {
      await Category.createCategory({
        name,
        slug,
        description,
        parent_id,
        brand_id,
        status,
        image,
      });
      res.status(201).json({ message: "Category created successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateCategory: async (req, res) => {
    const { id } = req.params;
    const { name, slug, description, parent_id, brand_id, status, image } =
      req.body;
    try {
      await Category.updateCategory(id, {
        name,
        slug,
        description,
        parent_id,
        brand_id,
        status,
        image,
      });
      res.json({ message: "Category updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params;
    try {
      await Category.deleteCategory(id);
      res.json({ message: "Category deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = CategoryController;
