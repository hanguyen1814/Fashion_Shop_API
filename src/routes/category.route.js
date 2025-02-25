const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/category.controller");

router.get("/getall", CategoryController.getAllCategories);
router.get("/getid/:id", CategoryController.getCategoryById);
router.post("/create", CategoryController.createCategory);
router.put("/update/:id", CategoryController.updateCategory);
router.delete("/delete/:id", CategoryController.deleteCategory);

module.exports = router;
