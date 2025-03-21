const db = require("../config/db");

const Order = {};

Order.createOrder = async (orderData) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Validate required fields
    const requiredFields = [
      "user_id",
      "recipient_name",
      "recipient_phone",
      "shipping_address",
      "total_price",
      "shipping_fee",
      "discount",
      "amount_paid",
      "payment_method",
      "shipping_method",
    ];
    for (const field of requiredFields) {
      if (orderData[field] === undefined || orderData[field] === null) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Insert order
    const [orderResult] = await connection.execute(
      `
      INSERT INTO orders (user_id, recipient_name, recipient_phone, shipping_address, 
                          total_price, shipping_fee, discount, amount_paid, 
                          payment_method, status, shipping_method, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        orderData.user_id,
        orderData.recipient_name,
        orderData.recipient_phone,
        orderData.shipping_address,
        orderData.total_price,
        orderData.shipping_fee,
        orderData.discount,
        orderData.amount_paid,
        orderData.payment_method,
        "pending",
        orderData.shipping_method,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    const orderItemsPromises = orderData.items.map((item) => {
      const itemFields = [
        "product_id",
        "variant_id",
        "quantity",
        "unit_price",
        "discount",
        "tax",
        "subtotal",
      ];
      for (const field of itemFields) {
        if (item[field] === undefined || item[field] === null) {
          throw new Error(`Missing required field in order item: ${field}`);
        }
      }
      return connection.execute(
        `
        INSERT INTO order_items (order_id, product_id, variant_id, quantity, 
                                 unit_price, discount, tax, subtotal, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `,
        [
          orderId,
          item.product_id,
          item.variant_id,
          item.quantity,
          item.unit_price,
          item.discount,
          item.tax,
          item.subtotal,
        ]
      );
    });
    await Promise.all(orderItemsPromises);

    // Fetch detailed order information
    const [orderDetails] = await connection.execute(
      `
      SELECT * FROM orders WHERE order_id = ?
      `,
      [orderId]
    );

    const [orderItems] = await connection.execute(
      `
      SELECT 
        oi.*, 
        p.name AS product_name, 
        p.image AS product_image, 
        v.color_id, 
        v.size_id, 
        v.price AS variant_price, 
        v.stock AS variant_stock, 
        v.image AS variant_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      LEFT JOIN variants v ON oi.variant_id = v.variant_id
      WHERE oi.order_id = ?
      `,
      [orderId]
    );

    await connection.commit();
    return { status: true, order: { ...orderDetails[0], items: orderItems } };
  } catch (error) {
    await connection.rollback();
    console.error("Error creating order:", error);
    return { status: false, error: error.message };
  } finally {
    connection.release();
  }
};

Order.getOrderById = async (orderId) => {
  try {
    // Fetch order details
    const [orderRows] = await db.execute(
      `
      SELECT * FROM orders WHERE order_id = ?
      `,
      [orderId]
    );

    if (orderRows.length === 0) {
      return { status: false, message: "Order not found" };
    }

    const order = orderRows[0];

    // Fetch order items
    const [items] = await db.execute(
      `
      SELECT * FROM order_items WHERE order_id = ?
      `,
      [orderId]
    );

    order.items = items;
    return { status: true, order };
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return { status: false, error: error.message };
  }
};

Order.cancelOrder = async (orderId) => {
  try {
    const [result] = await db.execute(
      `
      UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE order_id = ?
      `,
      [orderId]
    );

    if (result.affectedRows === 0) {
      return { status: false, message: "Order not found or already cancelled" };
    }

    return { status: true, message: "Order cancelled" };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return { status: false, error: error.message };
  }
};

module.exports = Order;
