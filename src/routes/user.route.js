const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/getall", UserController.getAllUsers);
router.get("/getid/:id", UserController.getUserById);
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.put("/update/:id", UserController.updateUser);
router.delete("/delete/:id", UserController.deleteUser);

module.exports = router;
