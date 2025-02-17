const express = require("express");
const UserController = require("../controllers/user.controller");
const router = express.Router();

router.get("/", UserController.getAll);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.create);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
