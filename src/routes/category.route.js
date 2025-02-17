const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.get("/get", categoryController.getAllCategories);
router.get("/catid/:id", categoryController.getCategoryById);
router.get("/parent/:parentId", categoryController.getSubCategories);
router.post("/create", categoryController.createCategory);
router.put("/updateid/:id", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
