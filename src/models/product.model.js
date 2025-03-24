const db = require("../config/db");

const Product = {};

const removeDiacritics = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

Product.getAll = async (page = 1, limit = 20) => {
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

Product.getByCatId = async (categoryId, page = 1, limit = 20) => {
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

      // Kiểm tra hoặc thêm mới màu sắc vào bảng models
      if (normalizedColorName) {
        const [colorRows] = await connection.query(
          "SELECT model_id FROM models WHERE name = ? AND `group` = 'color' LIMIT 1",
          [normalizedColorName]
        );
        if (colorRows.length > 0 && colorRows[0].model_id) {
          colorId = colorRows[0].model_id;
        } else {
          try {
            const [colorInsert] = await connection.query(
              "INSERT INTO models (name, `group`, created_at, updated_at) VALUES (?, 'color', NOW(), NOW())",
              [normalizedColorName]
            );
            colorId = colorInsert.insertId;
          } catch (err) {
            if (err.code === "ER_DUP_ENTRY") {
              const [existingColor] = await connection.query(
                "SELECT model_id FROM models WHERE name = ? AND `group` = 'color' LIMIT 1",
                [normalizedColorName]
              );
              if (existingColor.length > 0) {
                colorId = existingColor[0].model_id;
              }
            } else {
              throw err;
            }
          }
        }
      }

      // Kiểm tra hoặc thêm mới kích thước vào bảng models
      if (normalizedSizeName) {
        const [sizeRows] = await connection.query(
          "SELECT model_id FROM models WHERE name = ? AND `group` = 'size' LIMIT 1",
          [normalizedSizeName]
        );
        if (sizeRows.length > 0 && sizeRows[0].model_id) {
          sizeId = sizeRows[0].model_id;
        } else {
          try {
            const [sizeInsert] = await connection.query(
              "INSERT INTO models (name, `group`, created_at, updated_at) VALUES (?, 'size', NOW(), NOW())",
              [normalizedSizeName]
            );
            sizeId = sizeInsert.insertId;
          } catch (err) {
            if (err.code === "ER_DUP_ENTRY") {
              const [existingSize] = await connection.query(
                "SELECT model_id FROM models WHERE name = ? AND `group` = 'size' LIMIT 1",
                [normalizedSizeName]
              );
              if (existingSize.length > 0) {
                sizeId = existingSize[0].model_id;
              }
            } else {
              throw err;
            }
          }
        }
      }

      // Skip variant if both colorId and sizeId are null
      if (!colorId && !sizeId) {
        console.warn(
          `Skipping variant for product_id ${productId} due to missing color and size.`
        );
        continue;
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
  const connection = await db.getConnection(); // Lấy kết nối từ pool
  try {
    await connection.beginTransaction();

    // Cập nhật thông tin sản phẩm trong bảng products
    const productSql = `
      UPDATE products 
      SET category_id = ?, brand_id = ?, name = ?, description = ?, price = ?, origin_price = ?, discount = ?, stock = ?, image = ?, images = ?, updated_at = NOW() 
      WHERE product_id = ?`;
    const productValues = [
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

    const [productResult] = await connection.query(productSql, productValues);
    if (productResult.affectedRows === 0) {
      throw new Error("Product not found");
    }

    // Xóa các variants cũ của sản phẩm
    await connection.query("DELETE FROM variants WHERE product_id = ?", [
      productId,
    ]);

    // Xử lý variants mới
    for (const variant of updatedProduct.variants) {
      let colorId = null;
      let sizeId = null;

      // Chuẩn hóa tên màu sắc và kích thước thành chữ in hoa
      const normalizedColorName = variant.color_name
        ? variant.color_name.toUpperCase().trim()
        : null;
      const normalizedSizeName = variant.size_name
        ? variant.size_name.toUpperCase().trim()
        : null;

      // Kiểm tra hoặc thêm mới màu sắc vào bảng models
      if (normalizedColorName) {
        const [colorRows] = await connection.query(
          "SELECT model_id FROM models WHERE name = ? AND `group` = 'color' LIMIT 1",
          [normalizedColorName]
        );
        if (colorRows.length > 0 && colorRows[0].model_id) {
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
        if (sizeRows.length > 0 && sizeRows[0].model_id) {
          sizeId = sizeRows[0].model_id;
        } else {
          const [sizeInsert] = await connection.query(
            "INSERT INTO models (name, `group`, created_at, updated_at) VALUES (?, 'size', NOW(), NOW())",
            [normalizedSizeName]
          );
          sizeId = sizeInsert.insertId;
        }
      }

      // Skip variant if both colorId and sizeId are null
      if (!colorId && !sizeId) {
        console.warn(
          `Skipping variant for product_id ${productId} due to missing color and size.`
        );
        continue;
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

    return { status: true, product_id: productId, ...updatedProduct };
  } catch (err) {
    await connection.rollback();
    connection.release();
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
    return { status: true, message: "Product deleted successfully" };
  } catch (err) {
    console.error(err);
    return { status: false, error: err.message };
  }
};

Product.searchByName = async (name, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const sql = `
    SELECT 
      p.product_id,
      p.name,
      p.price,
      p.origin_price,
      p.discount,
      p.stock,
      p.image,
      p.images
      p.category_id,
      p.brand_id,
      p.created_at,
      p.updated_at
    FROM products p
    WHERE p.name_khong_dau LIKE ?
    LIMIT ? OFFSET ?;
  `;

  try {
    const [results] = await db.query(sql, [`%${name}%`, limit, offset]);

    return results;
  } catch (err) {
    console.error("Error searching products by name:", err);
    return [];
  }
};

Product.searchByColor = async (color, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const sql = `
    SELECT DISTINCT p.product_id, p.name, p.price, p.origin_price, p.discount, p.description,
           p.image, p.images, p.category_id, p.brand_id, p.created_at, p.updated_at
    FROM products p
    WHERE p.product_id IN (
      SELECT DISTINCT v.product_id
      FROM variants v
      JOIN models m ON v.color_id = m.model_id
      WHERE m.\`group\` = 'color'
        AND LOWER(CONVERT(m.name USING utf8)) LIKE ?
    )
    LIMIT ? OFFSET ?;
  `;

  try {
    const [results] = await db.query(sql, [`%${color}%`, limit, offset]);
    return results;
  } catch (err) {
    console.error("Error searching products by color:", err);
    return [];
  }
};

Product.searchBySize = async (size, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const sql = `
    SELECT DISTINCT p.product_id, p.name, p.price, p.origin_price, p.discount, p.description,
           p.image, p.images, p.category_id, p.brand_id, p.created_at, p.updated_at
    FROM products p
    WHERE p.product_id IN (
      SELECT DISTINCT v.product_id
      FROM variants v
      JOIN models m ON v.size_id = m.model_id
      WHERE m.\`group\` = 'size'
        AND LOWER(CONVERT(m.name USING utf8)) LIKE ?
    )
    LIMIT ? OFFSET ?;
  `;

  try {
    const [results] = await db.query(sql, [`%${size}%`, limit, offset]);
    return results;
  } catch (err) {
    console.error("Error searching products by size:", err);
    return [];
  }
};

Product.searchByPrice = async (minPrice, maxPrice, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const sql = `
    SELECT p.product_id, p.name, p.price, p.origin_price, p.discount, p.description,
           p.image, p.images, p.category_id, p.brand_id, p.created_at, p.updated_at
    FROM products p
    WHERE p.price >= ? AND p.price <= ?
    LIMIT ? OFFSET ?;
  `;

  try {
    const [results] = await db.query(sql, [minPrice, maxPrice, limit, offset]);
    return results;
  } catch (err) {
    console.error("Error searching products by price:", err);
    return [];
  }
};

module.exports = Product;
