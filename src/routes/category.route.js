const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/category.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  CategoryController.createCategory
);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  CategoryController.updateCategory
);

router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);
router.get("/slug/:slug", CategoryController.getCategoryBySlug);
router.delete("/:id", verifyToken, isAdmin, CategoryController.deleteCategory);

module.exports = router;
