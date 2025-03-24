const express = require("express");
const BrandController = require("../controllers/brand.controller");
const upload = require("../middlewares/upload");
const { verifyToken, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// Apply verifyToken globally to all routes
router.use(verifyToken);
router.get("/", BrandController.getAllBrands);
router.get("/:brandId", BrandController.getBrandById);

router.post("/", isAdmin, upload.single("logo"), BrandController.createBrand);
router.put(
  "/:brandId",
  isAdmin,
  upload.single("logo"),
  BrandController.updateBrand
);
router.delete("/:brandId", isAdmin, BrandController.deleteBrand);

// Public routes

module.exports = router;
