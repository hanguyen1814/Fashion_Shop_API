const db = require("../config/db");

const Product = {
  getAllProducts: () => {
    return db.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug, b.name AS brand_name, b.slug AS brand_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.category_id
       LEFT JOIN brands b ON p.brand_id = b.brand_id`
    );
  },

  getProductById: (id) => {
    return db.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug, b.name AS brand_name, b.slug AS brand_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.category_id
       LEFT JOIN brands b ON p.brand_id = b.brand_id
       WHERE p.product_id = ?`,
      [id]
    );
  },

  createProduct: (productData) => {
    const { name, description, category_id, brand_id, price, status, images } =
      productData;
    return db.query(
      "INSERT INTO products (name, description, category_id, brand_id, price, status, images) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, category_id, brand_id, price, status, images]
    );
  },

  updateProduct: (id, productData) => {
    const { name, description, category_id, brand_id, price, status, images } =
      productData;
    return db.query(
      "UPDATE products SET name = ?, description = ?, category_id = ?, brand_id = ?, price = ?, status = ?, images = ?, updated_at = NOW() WHERE product_id = ?",
      [name, description, category_id, brand_id, price, status, images, id]
    );
  },

  deleteProduct: (id) => {
    return db.query("DELETE FROM products WHERE product_id = ?", [id]);
  },

  searchProducts: (searchParams) => {
    const { id, catid, brandid, limit, offset } = searchParams;
    let query = `SELECT p.*, c.name AS category_name, c.slug AS category_slug, b.name AS brand_name, b.slug AS brand_slug
                 FROM products p
                 LEFT JOIN categories c ON p.category_id = c.category_id
                 LEFT JOIN brands b ON p.brand_id = b.brand_id
                 WHERE 1=1`;
    const params = [];

    if (id) {
      query += " AND p.product_id = ?";
      params.push(id);
    }
    if (catid) {
      query += " AND p.category_id = ?";
      params.push(catid);
    }
    if (brandid) {
      query += " AND p.brand_id = ?";
      params.push(brandid);
    }
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    return db.query(query, params);
  },

  getProductVariants: (productId) => {
    return db.query("SELECT * FROM variants WHERE product_id = ?", [productId]);
  },
};

module.exports = Product;
