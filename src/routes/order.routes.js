const express = require("express");
const OrderController = require("../controllers/order.controller");

const router = express.Router();

// Create a new order
router.post("/", OrderController.createOrder);

// Get order by ID
router.get("/:orderId", OrderController.getOrderById);

// Cancel an order
router.put("/:orderId/cancel", OrderController.cancelOrder);

module.exports = router;
