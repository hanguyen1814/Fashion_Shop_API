const db = require("../config/db");

class Product {
  static async getAllProducts(offset = 0, limit = 10) {
    try {
      const [rows] = await db.execute(`SELECT * FROM products LIMIT ?, ?`, [
        offset,
        limit,
      ]);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getProductsByCategory(categoryId, offset = 0, limit = 10) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM products WHERE category_id = ? LIMIT ?, ?`,
        [categoryId, offset, limit]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getProductById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM products WHERE product_id = ?`,
        [id]
      );
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createProduct(product) {
    try {
      const [result] = await db.execute(
        `INSERT INTO product (name, description, category_id, price, discount, stock, image_url, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.description,
          product.category_id,
          product.price,
          product.discount,
          product.stock,
          product.image_url,
          product.images,
        ]
      );
      return result.insertId;
    } catch (err) {
      throw err;
    }
  }

  static async updateProduct(id, product) {
    try {
      const [result] = await db.execute(
        `UPDATE product SET name = ?, description = ?, category_id = ?, price = ?, discount = ?, stock = ?, image_url = ?, images = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?`,
        [
          product.name,
          product.description,
          product.category_id,
          product.price,
          product.discount,
          product.stock,
          product.image_url,
          product.images,
          id,
        ]
      );
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  }

  static async deleteProduct(id) {
    try {
      const [result] = await db.execute(
        `DELETE FROM products WHERE product_id = ?`,
        [id]
      );
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Product;
