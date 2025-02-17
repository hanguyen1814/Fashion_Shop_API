const Category = require("../models/category.model");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.getCategoryById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const { parentId } = req.params;
    const categories = await Category.getSubCategories(parentId);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const categoryId = await Category.createCategory(req.body);
    res.status(201).json({
      message: "Category created successfully",
      category_id: categoryId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Category.updateCategory(id, req.body);
    if (affectedRows === 0)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Category.deleteCategory(id);
    if (affectedRows === 0)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getSubCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
