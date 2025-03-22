const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { verifyToken, isOwner, isAdmin } = require("../middlewares/auth");

router.get("/", verifyToken, isAdmin, UserController.getAllUsers);
router.get("/:user_id", verifyToken, isOwner, UserController.getUserById);
router.get("/me", verifyToken, UserController.getMe);
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.put(
  "/:user_id/password",
  verifyToken,
  isOwner,
  UserController.updatePassword
);
router.put("/:user_id", verifyToken, isOwner, UserController.updateUser);
router.delete("/:id", verifyToken, isAdmin, UserController.deleteUser);

module.exports = router;
