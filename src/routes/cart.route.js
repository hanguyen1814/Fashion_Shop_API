const express = require("express");
const cartController = require("../controllers/cart.controller");

const router = express.Router();

router.get("/get", cartController.getCartByUserId);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateCartItem);
router.delete("/delete", cartController.deleteCartItem);
router.delete("/clear", cartController.clearCart);

module.exports = router;
