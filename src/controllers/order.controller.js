const Order = require("../models/order.model");

const OrderController = {};

OrderController.createOrder = async (req, res) => {
  try {
    const { user_id } = req.params;
    const orderData = req.body;
    const result = await Order.createOrder(user_id, orderData);

    if (result.status) {
      return res.status(201).json({
        message: "Order created successfully",
        order: result.order,
      });
    } else {
      return res.status(400).json({
        message: "Failed to create order",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in createOrder:", error);
    if (error.message.startsWith("Missing required field")) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

OrderController.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await Order.getOrderById(orderId);

    if (result.status) {
      return res.status(200).json(result.order);
    } else {
      return res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

OrderController.editOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderData = req.body;
    const result = await Order.editOrder(orderId, orderData);

    if (result.status) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error in editOrder:", error);
    if (error.message.startsWith("Missing required field")) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

OrderController.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await Order.cancelOrder(orderId);

    if (result.status) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

OrderController.getAllOrders = async (req, res) => {
  try {
    const result = await Order.getAllOrders();

    if (result.status) {
      return res.status(200).json(result.orders);
    } else {
      return res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

OrderController.getOrdersByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await Order.getOrdersByUserId(user_id);

    if (result.status) {
      return res.status(200).json(result.orders);
    } else {
      return res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error in getOrdersByUser:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

OrderController.editOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const result = await Order.editOrderStatus(orderId, status);

    if (result.status) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error in editOrderStatus:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

OrderController.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const result = await Order.getOrdersByStatus(status);

    if (result.status) {
      return res.status(200).json(result.orders);
    } else {
      return res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error in getOrdersByStatus:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = OrderController;
