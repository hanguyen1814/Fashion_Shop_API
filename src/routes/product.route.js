const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  ProductController.createProductWithImage
);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  ProductController.updateProductWithImage
);

router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.get("/category/:category", ProductController.getProductsByCategory);
router.get("/search/name", ProductController.searchProductsByName);
router.get("/search/color", ProductController.searchProductsByColor);
router.get("/search/size", ProductController.searchProductsBySize);
router.get("/search/price", ProductController.searchProductsByPrice);

router.delete("/:id", verifyToken, isAdmin, ProductController.deleteProduct);

module.exports = router;
