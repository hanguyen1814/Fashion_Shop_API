const db = require("../config/db");

const Category = {
  getAllCategoriesWithBrands: () => {
    return db.query(
      `SELECT c.*, b.name AS brand_name, b.slug AS brand_slug, b.logo AS brand_logo,
              pc.category_id AS parent_category_id, pc.name AS parent_category_name, pc.slug AS parent_category_slug
       FROM categories c
       LEFT JOIN brands b ON c.brand_id = b.brand_id
       LEFT JOIN categories pc ON c.parent_id = pc.category_id
       ORDER BY c.parent_id IS NULL DESC, c.parent_id, c.category_id`
    );
  },

  getCategoryById: (id) => {
    return db.query(
      `SELECT c.*, b.name AS brand_name, b.slug AS brand_slug, b.logo AS brand_logo,
              pc.category_id AS parent_category_id, pc.name AS parent_category_name, pc.slug AS parent_category_slug,
              cc.category_id AS child_category_id, cc.name AS child_category_name, cc.slug AS child_category_slug
       FROM categories c
       LEFT JOIN brands b ON c.brand_id = b.brand_id
       LEFT JOIN categories pc ON c.parent_id = pc.category_id
       LEFT JOIN categories cc ON cc.parent_id = c.category_id
       WHERE c.category_id = ?`,
      [id]
    );
  },

  getCategoryBySlug: (slug) => {
    return db.query(
      `SELECT c.*, b.name AS brand_name, b.slug AS brand_slug, b.logo AS brand_logo,
              pc.category_id AS parent_category_id, pc.name AS parent_category_name, pc.slug AS parent_category_slug,
              cc.category_id AS child_category_id, cc.name AS child_category_name, cc.slug AS child_category_slug
       FROM categories c
       LEFT JOIN brands b ON c.brand_id = b.brand_id
       LEFT JOIN categories pc ON c.parent_id = pc.category_id
       LEFT JOIN categories cc ON cc.parent_id = c.category_id
       WHERE c.slug = ?`,
      [slug]
    );
  },

  createCategory: (categoryData) => {
    const { name, slug, description, parent_id, brand_id, status, image } =
      categoryData;
    return db.query(
      "INSERT INTO categories (name, slug, description, parent_id, brand_id, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, slug, description, parent_id, brand_id, status, image]
    );
  },

  updateCategory: (id, categoryData) => {
    const { name, slug, description, parent_id, brand_id, status, image } =
      categoryData;
    return db.query(
      "UPDATE categories SET name = ?, slug = ?, description = ?, parent_id = ?, brand_id = ?, status = ?, image = ?, updated_at = NOW() WHERE category_id = ?",
      [name, slug, description, parent_id, brand_id, status, image, id]
    );
  },

  deleteCategory: (id) => {
    return db.query("DELETE FROM categories WHERE category_id = ?", [id]);
  },
};

module.exports = Category;
