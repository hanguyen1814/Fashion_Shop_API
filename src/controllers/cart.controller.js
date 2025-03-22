const Cart = require("../models/cart.model");

const cartController = {
  getCartByUserId: async (req, res) => {
    const { user_id } = req.params;
    try {
      const cartItems = await Cart.getCartByUserId(user_id);
      res
        .status(200)
        .json({ status: true, data: cartItems, message: "Cart retrieved" });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },
  addToCart: async (req, res) => {
    const { user_id } = req.params;
    const { productId, variantId, quantity } = req.body;
    try {
      const result = await Cart.addToCart(
        user_id,
        productId,
        variantId,
        quantity
      );
      if (!result.status) {
        return res.status(400).json({ status: false, message: result.error });
      }
      res.status(201).json({
        status: true,
        data: result.product,
        message: "Item added to cart",
      });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },
  updateCartItem: async (req, res) => {
    const { user_id } = req.params;
    const { cartId, quantity } = req.body;
    try {
      const result = await Cart.updateCartItem(user_id, cartId, quantity);
      if (!result.status) {
        return res.status(400).json({ status: false, message: result.error });
      }
      res.status(200).json({
        status: true,
        data: result.updatedItem,
        message: "Cart item updated",
      });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },
  deleteCartItem: async (req, res) => {
    const { user_id } = req.params;
    const { cart_id } = req.query;
    try {
      const result = await Cart.deleteCartItem(user_id, cart_id);
      if (!result.status) {
        return res.status(400).json({ status: false, message: result.error });
      }
      res.status(200).json({ status: true, message: "Cart item deleted" });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },
  clearCart: async (req, res) => {
    const { user_id } = req.params;
    try {
      const result = await Cart.clearCart(user_id);
      if (!result.status) {
        return res.status(400).json({ status: false, message: result.error });
      }
      res.status(200).json({ status: true, message: "Cart cleared" });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },
};

module.exports = cartController;
