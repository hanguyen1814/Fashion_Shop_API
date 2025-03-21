const Order = require("../models/order.model");

const OrderController = {};

OrderController.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const result = await Order.createOrder(orderData);

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

module.exports = OrderController;
