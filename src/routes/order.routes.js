const express = require("express");
const OrderController = require("../controllers/order.controller");
const { verifyToken, isAdmin, isOwner } = require("../middlewares/auth");

const router = express.Router();

// Apply verifyToken globally to all routes
router.use(verifyToken);

// Admin routes
router.get("/getall", isAdmin, OrderController.getAllOrders);
router.get("/status/:status", isAdmin, OrderController.getOrdersByStatus);
router.patch(
  "/:user_id/:orderId/status",
  isAdmin,
  OrderController.editOrderStatus
);

// User-specific routes
router.get("/:user_id", isOwner, OrderController.getOrdersByUser);
router.post("/:user_id/checkout", isOwner, OrderController.createOrder);
router.get("/:user_id/:orderId", isOwner, OrderController.getOrderById);
router.patch("/:user_id/:orderId", isOwner, OrderController.editOrder);
router.patch("/:user_id/:orderId/cancel", isOwner, OrderController.cancelOrder);

module.exports = router;
