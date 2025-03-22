const express = require("express");
const BrandController = require("../controllers/brand.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// Apply verifyToken globally to all routes
router.use(verifyToken);

// Admin routes
router.post("/", isAdmin, BrandController.createBrand);
router.put("/:brandId", isAdmin, BrandController.updateBrand);
router.delete("/:brandId", isAdmin, BrandController.deleteBrand);

// Public routes
router.get("/", BrandController.getAllBrands);
router.get("/:brandId", BrandController.getBrandById);

module.exports = router;
