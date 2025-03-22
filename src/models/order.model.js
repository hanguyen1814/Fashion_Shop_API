const db = require("../config/db");

const Order = {};

Order.createOrder = async (userId, orderData) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Validate required fields
    const requiredFields = [
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
        userId,
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

    // Insert order items and update stock
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    const orderItemsPromises = orderData.items.map(async (item) => {
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

      // Validate that the variant belongs to the correct product
      const [variantValidation] = await connection.execute(
        `
        SELECT 1 FROM variants WHERE variant_id = ? AND product_id = ?
        `,
        [item.variant_id, item.product_id]
      );

      if (!variantValidation.length) {
        throw new Error(
          `Variant ID ${item.variant_id} does not belong to Product ID ${item.product_id}`
        );
      }

      // Check stock availability
      const [variantStock] = await connection.execute(
        `
        SELECT stock FROM variants WHERE variant_id = ?
        `,
        [item.variant_id]
      );

      if (!variantStock.length || variantStock[0].stock < item.quantity) {
        throw new Error(
          `Insufficient stock for variant_id: ${item.variant_id}`
        );
      }

      // Insert order item
      await connection.execute(
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

      // Deduct stock for the variant
      await connection.execute(
        `
        UPDATE variants
        SET stock = stock - ?
        WHERE variant_id = ?;
        `,
        [item.quantity, item.variant_id]
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
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Check if the order exists and its status
    const [order] = await connection.execute(
      `
      SELECT status FROM orders WHERE order_id = ?
      `,
      [orderId]
    );

    if (!order.length) {
      throw new Error("Order not found");
    }

    const currentStatus = order[0].status;
    if (currentStatus !== "pending" && currentStatus !== "processing") {
      throw new Error(
        "Only orders with status 'pending' or 'processing' can be cancelled"
      );
    }

    // Restore stock for each item in the order
    const [orderItems] = await connection.execute(
      `
      SELECT variant_id, quantity FROM order_items WHERE order_id = ?
      `,
      [orderId]
    );

    const restoreStockPromises = orderItems.map((item) =>
      connection.execute(
        `
        UPDATE variants
        SET stock = stock + ?
        WHERE variant_id = ?;
        `,
        [item.quantity, item.variant_id]
      )
    );

    await Promise.all(restoreStockPromises);

    // Update order status to cancelled
    await connection.execute(
      `
      UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE order_id = ?
      `,
      [orderId]
    );

    await connection.commit();
    return { status: true, message: "Order cancelled and stock restored" };
  } catch (error) {
    await connection.rollback();
    console.error("Error cancelling order:", error);
    return { status: false, error: error.message };
  } finally {
    connection.release();
  }
};

Order.editOrder = async (orderId, orderData) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Validate required fields
    const requiredFields = [
      "recipient_name",
      "recipient_phone",
      "shipping_address",
    ];
    for (const field of requiredFields) {
      if (orderData[field] === undefined || orderData[field] === null) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Check if order status is pending or processing
    const [orderStatus] = await connection.execute(
      `
      SELECT status FROM orders WHERE order_id = ?
      `,
      [orderId]
    );

    if (
      orderStatus[0].status !== "pending" &&
      orderStatus[0].status !== "processing"
    ) {
      throw new Error("Order status must be pending or processing to edit");
    }

    // Update order
    await connection.execute(
      `
      UPDATE orders 
      SET recipient_name = ?, recipient_phone = ?, shipping_address = ?, updated_at = NOW()
      WHERE order_id = ?
      `,
      [
        orderData.recipient_name,
        orderData.recipient_phone,
        orderData.shipping_address,
        orderId,
      ]
    );

    await connection.commit();
    return { status: true, message: "Order updated" };
  } catch (error) {
    await connection.rollback();
    console.error("Error updating order:", error);
    return { status: false, error: error.message };
  } finally {
    connection.release();
  }
};
// Get all orders
Order.getAllOrders = async () => {
  try {
    const [orders] = await db.execute(
      `
      SELECT * FROM orders
      `
    );

    return { status: true, orders };
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return { status: false, error: error.message };
  }
};

// Get orders by user ID
Order.getOrdersByUserId = async (userId) => {
  try {
    const [orders] = await db.execute(
      `
      SELECT * FROM orders WHERE user_id = ?
      `,
      [userId]
    );

    return { status: true, orders };
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    return { status: false, error: error.message };
  }
};

// edit order status
Order.editOrderStatus = async (orderId, status) => {
  try {
    await db.execute(
      `
      UPDATE orders SET status = ?, updated_at = NOW() WHERE order_id = ?
      `,
      [status, orderId]
    );

    return { status: true, message: "Order status updated" };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { status: false, error: error.message };
  }
};

// Get orders by status
Order.getOrdersByStatus = async (status) => {
  try {
    const [orders] = await db.execute(
      `
      SELECT * FROM orders WHERE status = ?
      `,
      [status]
    );

    return { status: true, orders };
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return { status: false, error: error.message };
  }
};

module.exports = Order;
