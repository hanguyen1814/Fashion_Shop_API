const Category = require("../models/category.model");

const CategoryController = {
  getAllCategories: async (req, res) => {
    try {
      const [results] = await Category.getAllCategoriesWithBrands();
      const buildCategoryTree = (categories, parentId = null) => {
        return categories
          .filter((cat) => cat.parent_id === parentId)
          .map((cat) => ({
            category_id: cat.category_id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            parent_id: cat.parent_id,
            status: cat.status,
            image: cat.image,
            brand: cat.brand_id
              ? {
                  brand_id: cat.brand_id,
                  name: cat.brand_name,
                  slug: cat.brand_slug,
                  logo: cat.brand_logo,
                }
              : null,
            parent_category: cat.parent_category_id
              ? {
                  category_id: cat.parent_category_id,
                  name: cat.parent_category_name,
                  slug: cat.parent_category_slug,
                }
              : null,
            children: buildCategoryTree(categories, cat.category_id),
          }));
      };

      const categoryTree = buildCategoryTree(results);
      res.json(categoryTree);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getCategoryById: async (req, res) => {
    const { id } = req.params;
    try {
      const [results] = await Category.getCategoryById(id);
      if (results.length === 0)
        return res.status(404).json({ message: "Category not found" });

      const cat = results[0];
      const category = {
        category_id: cat.category_id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        parent_id: cat.parent_id,
        status: cat.status,
        image: cat.image,
        brand: cat.brand_id
          ? {
              brand_id: cat.brand_id,
              name: cat.brand_name,
              slug: cat.brand_slug,
              logo: cat.brand_logo,
            }
          : null,
        parent_category: cat.parent_category_id
          ? {
              category_id: cat.parent_category_id,
              name: cat.parent_category_name,
              slug: cat.parent_category_slug,
            }
          : null,
        children: results
          .filter((child) => child.child_category_id)
          .map((child) => ({
            category_id: child.child_category_id,
            name: child.child_category_name,
            slug: child.child_category_slug,
          })),
      };
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getCategoryBySlug: async (req, res) => {
    const { slug } = req.params;
    try {
      const [results] = await Category.getCategoryBySlug(slug);
      if (results.length === 0)
        return res.status(404).json({ message: "Category not found" });

      const cat = results[0];
      const category = {
        category_id: cat.category_id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        parent_id: cat.parent_id,
        status: cat.status,
        image: cat.image,
        brand: cat.brand_id
          ? {
              brand_id: cat.brand_id,
              name: cat.brand_name,
              slug: cat.brand_slug,
              logo: cat.brand_logo,
            }
          : null,
        parent_category: cat.parent_category_id
          ? {
              category_id: cat.parent_category_id,
              name: cat.parent_category_name,
              slug: cat.parent_category_slug,
            }
          : null,
        children: results
          .filter((child) => child.child_category_id)
          .map((child) => ({
            category_id: child.child_category_id,
            name: child.child_category_name,
            slug: child.child_category_slug,
          })),
      };
      res.json(category);
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
