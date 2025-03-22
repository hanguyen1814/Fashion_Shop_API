const express = require("express");
const cartController = require("../controllers/cart.controller");
const router = express.Router();
const { verifyToken, isOwner } = require("../middlewares/auth");

router.get("/:user_id", verifyToken, isOwner, cartController.getCartByUserId);
router.post("/:user_id", verifyToken, isOwner, cartController.addToCart);
router.put("/:user_id", verifyToken, isOwner, cartController.updateCartItem);
router.delete(
  "/:user_id/item",
  verifyToken,
  isOwner,
  cartController.deleteCartItem
);
router.delete("/:user_id", verifyToken, isOwner, cartController.clearCart);

module.exports = router;
