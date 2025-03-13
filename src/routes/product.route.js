const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller");

router.get("/getall", ProductController.getAllProducts);
router.get("/getid/:id", ProductController.getProductById);
router.get("/getcat/:category", ProductController.getProductsByCategory);
router.post("/create", ProductController.createProduct);
router.put("/update/:id", ProductController.updateProduct);
router.delete("/delete/:id", ProductController.deleteProduct);

module.exports = router;
