const db = require("../config/db");

class Category {
  static async getAllCategories() {
    try {
      const [rows] = await db.execute(`SELECT * FROM categories`);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getCategoryById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM categories WHERE category_id = ?`,
        [id]
      );
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async getSubCategories(parentId) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM categories WHERE parent_id = ?`,
        [parentId]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async createCategory(category) {
    try {
      const [result] = await db.execute(
        `INSERT INTO categories (name, description, parent_id, image) VALUES (?, ?, ?, ?)`,
        [
          category.name,
          category.description,
          category.parent_id,
          category.image,
        ]
      );
      return result.insertId;
    } catch (err) {
      throw err;
    }
  }

  static async updateCategory(id, category) {
    try {
      const [result] = await db.execute(
        `UPDATE categories SET name = ?, description = ?, parent_id = ?, image = ?, updated_at = CURRENT_TIMESTAMP WHERE category_id = ?`,
        [
          category.name,
          category.description,
          category.parent_id,
          category.image,
          id,
        ]
      );
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  }

  static async deleteCategory(id) {
    try {
      const [result] = await db.execute(
        `DELETE FROM categories WHERE category_id = ?`,
        [id]
      );
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Category;
