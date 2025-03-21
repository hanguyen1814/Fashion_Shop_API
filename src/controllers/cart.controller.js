const Cart = require("../models/cart.model");

const cartController = {
  getCartByUserId: async (req, res) => {
    const { user_id } = req.query;
    try {
      const cartItems = await Cart.getCartByUserId(user_id);
      res.status(200).json(cartItems);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  addToCart: async (req, res) => {
    const { user_id } = req.query;
    const { productId, variantId, quantity } = req.body;
    try {
      const result = await Cart.addToCart(
        user_id,
        productId,
        variantId,
        quantity
      );
      if (!result.status) {
        return res.status(400).json({ error: result.error });
      }
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateCartItem: async (req, res) => {
    const { user_id } = req.query;
    const { cartId, quantity } = req.body;
    try {
      const result = await Cart.updateCartItem(user_id, cartId, quantity);
      if (!result.status) {
        return res.status(400).json({ error: result.error });
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteCartItem: async (req, res) => {
    const { user_id } = req.query;
    const { cart_id } = req.query;
    try {
      const result = await Cart.deleteCartItem(user_id, cart_id);
      if (!result.status) {
        return res.status(400).json({ error: result.error });
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  clearCart: async (req, res) => {
    const { user_id } = req.query;
    try {
      const result = await Cart.clearCart(user_id);
      if (!result.status) {
        return res.status(400).json({ error: result.error });
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = cartController;
