const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/category.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth");

router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);
router.get("/slug/:slug", CategoryController.getCategoryBySlug);
router.post("/", verifyToken, isAdmin, CategoryController.createCategory);
router.put("/:id", verifyToken, isAdmin, CategoryController.updateCategory);
router.delete("/:id", verifyToken, isAdmin, CategoryController.deleteCategory);

module.exports = router;
