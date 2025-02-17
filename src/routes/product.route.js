const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.get("/get", productController.getAllProducts);
router.get("/getbycatid/:categoryId", productController.getProductsByCategory);
router.get("/getbyid/:id", productController.getProductById);
router.post("/creat", productController.createProduct);
router.put("/updateid/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
