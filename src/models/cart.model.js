const db = require("../config/db");

const Cart = {};

Cart.getCartByUserId = async (userId) => {
  const sql = `
    SELECT 
      c.cart_id, c.user_id, c.product_id, c.variant_id, c.quantity, c.added_at,
      p.name AS product_name, p.image AS product_image,
      v.color_id, v.size_id, v.price, v.stock, v.image AS variant_image
    FROM cart c
    JOIN products p ON c.product_id = p.product_id
    LEFT JOIN variants v ON c.variant_id = v.variant_id
    WHERE c.user_id = ?;
  `;
  try {
    const [results] = await db.query(sql, [userId]);
    return results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

Cart.addToCart = async (userId, productId, variantId, quantity) => {
  const sql = `
    INSERT INTO cart (user_id, product_id, variant_id, quantity, added_at)
    VALUES (?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), added_at = NOW();
  `;

  try {
    // Thêm hoặc cập nhật giỏ hàng
    await db.query(sql, [userId, productId, variantId, quantity]);

    // Truy vấn lấy thông tin chi tiết sản phẩm
    const [productDetails] = await db.query(
      `
      SELECT 
        p.name AS product_name, 
        p.image AS product_image,
        v.price, 
        v.stock, 
        v.color_id, 
        v.size_id, 
        v.image AS variant_image,
        c.quantity AS cart_quantity
      FROM cart c
      JOIN products p ON c.product_id = p.product_id
      JOIN variants v ON c.variant_id = v.variant_id
      WHERE c.user_id = ? AND c.product_id = ? AND c.variant_id = ?;
      `,
      [userId, productId, variantId]
    );

    return {
      status: true,
      message: "Item added to cart",
      product: productDetails[0] || null,
    };
  } catch (err) {
    console.error(err);
    return { status: false, error: err.message };
  }
};

Cart.updateCartItem = async (userId, cartId, quantity) => {
  const sql = `
    UPDATE cart
    SET quantity = ?, added_at = NOW()
    WHERE cart_id = ? AND user_id = ?;
  `;
  try {
    const [result] = await db.query(sql, [quantity, cartId, userId]);
    if (result.affectedRows === 0) {
      throw new Error("Cart item not found");
    }
    const [updatedItem] = await db.query(
      `
      SELECT 
        c.cart_id, c.quantity, c.added_at,
        p.name AS product_name, p.image AS product_image,
        v.price, v.stock, v.color_id, v.size_id, v.image AS variant_image
      FROM cart c
      JOIN products p ON c.product_id = p.product_id
      LEFT JOIN variants v ON c.variant_id = v.variant_id
      WHERE c.cart_id = ?;
      `,
      [cartId]
    );
    return {
      status: true,
      message: "Cart item updated",
      updatedItem: updatedItem[0],
    };
  } catch (err) {
    console.error(err);
    return { status: false, error: err.message };
  }
};

Cart.deleteCartItem = async (userId, cartId) => {
  const sql = `
    DELETE FROM cart
    WHERE cart_id = ? AND user_id = ?;
  `;
  try {
    const [result] = await db.query(sql, [cartId, userId]);
    if (result.affectedRows === 0) {
      throw new Error("Cart item not found");
    }
    return { status: true, message: "Cart item deleted" };
  } catch (err) {
    console.error(err);
    return { status: false, error: err.message };
  }
};

Cart.clearCart = async (userId) => {
  const sql = `
    DELETE FROM cart
    WHERE user_id = ?;
  `;
  try {
    await db.query(sql, [userId]);
    return { status: true, message: "Cart cleared" };
  } catch (err) {
    console.error(err);
    return { status: false, error: err.message };
  }
};

module.exports = Cart;
