const db = require("../config/db");

const Product = {};

Product.getAll = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  // Bước 1: Lấy danh sách product_id cần lấy
  const productIdsQuery = `
      SELECT product_id
      FROM products
      ORDER BY product_id
      LIMIT ? OFFSET ?;
  `;

  try {
    const [productIds] = await db.query(productIdsQuery, [limit, offset]);
    if (productIds.length === 0) return [];

    const ids = productIds.map((p) => p.product_id);

    // Bước 2: Truy vấn chi tiết sản phẩm và biến thể
    const sql = `
        SELECT 
            p.*, 
            v.variant_id, v.color_id, c.name AS color_name, 
            v.size_id, s.name AS size_name, 
            v.price, v.origin_price, v.discount, v.stock, v.image AS variant_image
        FROM products p
        LEFT JOIN variants v ON p.product_id = v.product_id
        LEFT JOIN models c ON v.color_id = c.model_id AND c.\`group\` = 'color'
        LEFT JOIN models s ON v.size_id = s.model_id AND s.\`group\` = 'size'
        WHERE p.product_id IN (${ids.join(",")});
    `;

    const [results] = await db.query(sql);

    // Xử lý dữ liệu như cũ
    const productsMap = {};
    results.forEach((row) => {
      if (!productsMap[row.product_id]) {
        productsMap[row.product_id] = {
          product_id: row.product_id,
          category_id: row.category_id,
          brand: row.brand_id,
          name: row.name,
          price: Infinity,
          origin_price: Infinity,
          discount: Infinity,
          stock: 0,
          description: row.description,
          image: row.image,
          images: row.images,
          created_at: row.created_at,
          updated_at: row.updated_at,
          variants: [],
        };
      }

      if (row.variant_id) {
        productsMap[row.product_id].variants.push({
          variant_id: row.variant_id,
          color_id: row.color_id,
          color_name: row.color_name || null,
          size_id: row.size_id,
          size_name: row.size_name || null,
          price: row.price,
          origin_price: row.origin_price,
          discount: row.discount,
          stock: row.stock,
          variant_image: row.variant_image,
        });

        // Update giá thấp nhất, tồn kho, giảm giá
        productsMap[row.product_id].stock += row.stock;
        productsMap[row.product_id].price = Math.min(
          productsMap[row.product_id].price,
          row.price
        );
        productsMap[row.product_id].origin_price = Math.min(
          productsMap[row.product_id].origin_price,
          row.origin_price
        );
        productsMap[row.product_id].discount = Math.min(
          productsMap[row.product_id].discount,
          row.discount
        );
      }
    });

    return Object.values(productsMap);
  } catch (err) {
    console.error(err);
    return [];
  }
};

Product.getById = async (productId) => {
  const sql = `
        SELECT 
            p.*, 
            v.variant_id, v.color_id, c.name AS color_name, 
            v.size_id, s.name AS size_name, 
            v.price, v.origin_price, v.discount, v.stock, v.image AS variant_image
        FROM products p
        LEFT JOIN variants v ON p.product_id = v.product_id
        LEFT JOIN models c ON v.color_id = c.model_id AND c.\`group\` = 'color'
        LEFT JOIN models s ON v.size_id = s.model_id AND s.\`group\` = 'size'
        WHERE p.product_id = ?
    `;

  try {
    const [results] = await db.query(sql, [productId]);

    if (results.length === 0) {
      throw new Error("Product not found");
    }

    const productsMap = {};
    results.forEach((row) => {
      if (!productsMap[row.product_id]) {
        productsMap[row.product_id] = {
          product_id: row.product_id,
          category_id: row.category_id,
          brand: row.brand_id,
          name: row.name,
          price: Infinity,
          origin_price: Infinity,
          discount: Infinity,
          stock: 0,
          description: row.description,
          image: row.image,
          images: row.images,
          created_at: row.created_at,
          updated_at: row.updated_at,
          variants: [],
        };
      }

      if (row.variant_id) {
        productsMap[row.product_id].variants.push({
          variant_id: row.variant_id,
          color_id: row.color_id,
          color_name: row.color_name || null,
          size_id: row.size_id,
          size_name: row.size_name || null,
          price: row.price,
          origin_price: row.origin_price,
          discount: row.discount,
          stock: row.stock,
          variant_image: row.variant_image,
        });

        // Update product stock, price, and discount
        productsMap[row.product_id].stock += row.stock;
        productsMap[row.product_id].price = Math.min(
          productsMap[row.product_id].price,
          row.price
        );
        productsMap[row.product_id].origin_price = Math.min(
          productsMap[row.product_id].origin_price,
          row.origin_price
        );
        productsMap[row.product_id].discount = Math.min(
          productsMap[row.product_id].discount,
          row.discount
        );
      }
    });

    return Object.values(productsMap)[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};

Product.getByCatId = async (categoryId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const productIdsQuery = `
      SELECT product_id
      FROM products
      WHERE category_id = ?
      ORDER BY product_id
      LIMIT ? OFFSET ?;
  `;

  try {
    const [productIds] = await db.query(productIdsQuery, [
      categoryId,
      limit,
      offset,
    ]);
    if (productIds.length === 0) return [];

    const ids = productIds.map((p) => p.product_id);

    const sql = `
        SELECT 
            p.*, 
            v.variant_id, v.color_id, c.name AS color_name, 
            v.size_id, s.name AS size_name, 
            v.price, v.origin_price, v.discount, v.stock, v.image AS variant_image
        FROM products p
        LEFT JOIN variants v ON p.product_id = v.product_id
        LEFT JOIN models c ON v.color_id = c.model_id AND c.\`group\` = 'color'
        LEFT JOIN models s ON v.size_id = s.model_id AND s.\`group\` = 'size'
        WHERE p.product_id IN (${ids.join(",")});
    `;

    const [results] = await db.query(sql);

    const productsMap = {};
    results.forEach((row) => {
      if (!productsMap[row.product_id]) {
        productsMap[row.product_id] = {
          product_id: row.product_id,
          category_id: row.category_id,
          brand: row.brand_id,
          name: row.name,
          price: Infinity,
          origin_price: Infinity,
          discount: Infinity,
          stock: 0,
          description: row.description,
          image: row.image,
          images: row.images,
          created_at: row.created_at,
          updated_at: row.updated_at,
          variants: [],
        };
      }

      if (row.variant_id) {
        productsMap[row.product_id].variants.push({
          variant_id: row.variant_id,
          color_id: row.color_id,
          color_name: row.color_name || null,
          size_id: row.size_id,
          size_name: row.size_name || null,
          price: row.price,
          origin_price: row.origin_price,
          discount: row.discount,
          stock: row.stock,
          variant_image: row.variant_image,
        });

        // Update product stock, price, and discount
        productsMap[row.product_id].stock += row.stock;
        productsMap[row.product_id].price = Math.min(
          productsMap[row.product_id].price,
          row.price
        );
        productsMap[row.product_id].origin_price = Math.min(
          productsMap[row.product_id].origin_price,
          row.origin_price
        );
        productsMap[row.product_id].discount = Math.min(
          productsMap[row.product_id].discount,
          row.discount
        );
      }
    });

    return Object.values(productsMap);
  } catch (err) {
    console.error(err);
    return [];
  }
};

Product.create = async (newProduct) => {
  const connection = await db.getConnection(); // Lấy kết nối từ pool
  try {
    await connection.beginTransaction();

    // Thêm sản phẩm mới vào bảng products
    const productSql = `
            INSERT INTO products (category_id, brand_id, name, description, price, origin_price, discount, stock, sold, image, images, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    const productValues = [
      newProduct.category_id,
      newProduct.brand_id,
      newProduct.name,
      newProduct.description,
      newProduct.price,
      newProduct.origin_price,
      newProduct.discount,
      newProduct.stock,
      newProduct.sold,
      newProduct.image,
      JSON.stringify(newProduct.images), // Lưu images dưới dạng JSON
    ];

    const [productResult] = await connection.query(productSql, productValues);
    const productId = productResult.insertId;

    // Xử lý variants
    for (const variant of newProduct.variants) {
      let colorId = null;
      let sizeId = null;

      // Chuẩn hóa tên màu sắc và kích thước thành chữ in hoa
      const normalizedColorName = variant.color_name
        ? variant.color_name.toUpperCase().trim()
        : null;
      const normalizedSizeName = variant.size_name
        ? variant.size_name.toUpperCase().trim()
        : null;

      // Cập nhật lại variant với tên đã chuẩn hóa
      variant.color_name = normalizedColorName;
      variant.size_name = normalizedSizeName;

      await connection.query("LOCK TABLES models WRITE;"); // Khóa bảng models để tránh deadlock
      try {
        // Kiểm tra hoặc thêm mới màu sắc vào bảng models
        if (normalizedColorName) {
          const [colorRows] = await connection.query(
            "SELECT model_id FROM models WHERE name = ? AND `group` = 'color' LIMIT 1",
            [normalizedColorName]
          );
          if (colorRows.length > 0) {
            colorId = colorRows[0].model_id;
          } else {
            const [colorInsert] = await connection.query(
              "INSERT INTO models (name, `group`, created_at, updated_at) VALUES (?, 'color', NOW(), NOW())",
              [normalizedColorName]
            );
            colorId = colorInsert.insertId;
          }
        }

        // Kiểm tra hoặc thêm mới kích thước vào bảng models
        if (normalizedSizeName) {
          const [sizeRows] = await connection.query(
            "SELECT model_id FROM models WHERE name = ? AND `group` = 'size' LIMIT 1",
            [normalizedSizeName]
          );
          if (sizeRows.length > 0) {
            sizeId = sizeRows[0].model_id;
          } else {
            const [sizeInsert] = await connection.query(
              "INSERT INTO models (name, `group`, created_at, updated_at) VALUES (?, 'size', NOW(), NOW())",
              [normalizedSizeName]
            );
            sizeId = sizeInsert.insertId;
          }
        }
      } finally {
        await connection.query("UNLOCK TABLES;"); // Mở khóa bảng models sau khi xử lý
      }

      // Thêm variant vào bảng variants
      const variantSql = `
    INSERT INTO variants (product_id, color_id, size_id, price, origin_price, discount, stock, image, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

      const variantValues = [
        productId,
        colorId,
        sizeId,
        variant.price,
        variant.origin_price,
        variant.discount,
        variant.stock,
        variant.image,
      ];

      await connection.query(variantSql, variantValues);
    }

    await connection.commit(); // Xác nhận giao dịch
    connection.release(); // Giải phóng kết nối

    return { status: true, product_id: productId, ...newProduct };
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error(err);
    return { status: false, error: err.message };
  }
};

Product.update = async (productId, updatedProduct) => {
  const sql =
    "UPDATE products SET category_id = ?, brand_id = ?, name = ?, description = ?, price = ?, origin_price = ?, discount = ?, stock = ?, image = ?, images = ?, updated_at = NOW() WHERE product_id = ?";
  const values = [
    updatedProduct.category_id,
    updatedProduct.brand_id,
    updatedProduct.name,
    updatedProduct.description,
    updatedProduct.price,
    updatedProduct.origin_price,
    updatedProduct.discount,
    updatedProduct.stock,
    updatedProduct.image,
    JSON.stringify(updatedProduct.images),
    productId,
  ];

  try {
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      throw new Error("Product not found");
    }
    return { id: productId, ...updatedProduct };
  } catch (err) {
    console.error(err);
    return { status: false, error: err.message };
  }
};

Product.delete = async (productId) => {
  const sql = "DELETE FROM products WHERE product_id = ?";

  try {
    const [result] = await db.query(sql, [productId]);
    if (result.affectedRows === 0) {
      throw new Error("Product not found");
    }
    return { message: "Product deleted successfully" };
  } catch (err) {
    console.error(err);
    return { status: false, error: err.message };
  }
};

module.exports = Product;
