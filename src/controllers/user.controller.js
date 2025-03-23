const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const UserController = {
  // Lấy danh sách người dùng
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      res.json({ status: true, data: users });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  },

  // Lấy thông tin một người dùng
  getUserById: async (req, res) => {
    const { user_id } = req.params;
    try {
      const users = await userModel.getUserById(user_id);
      if (users.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }
      res.json({ status: true, data: users[0] });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  },

  getMe: async (req, res) => {
    try {
      const userId = req.user.user_id; // Ensure user_id is correctly accessed
      const result = await userModel.getUserById(userId); // Use getUserById to fetch user details
      console.log(result);
      if (result.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }
      res.json({ status: true, data: result[0] });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },

  // Đăng ký người dùng
  registerUser: async (req, res) => {
    try {
      const { full_name, email, password, phone, address } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      await userModel.createUser({
        full_name,
        email,
        password_hash: hashedPassword,
        phone,
        address,
      });

      res
        .status(201)
        .json({ status: true, message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  },

  // Đăng nhập người dùng
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const users = await userModel.loginUser(email);
      if (users.length === 0) {
        return res
          .status(401)
          .json({ status: false, message: "Invalid email or password" });
      }

      const user = users[0];
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isValidPassword) {
        return res
          .status(401)
          .json({ status: false, message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "30d" }
      );

      res.json({ status: true, message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  },

  // update password
  updatePassword: async (req, res) => {
    const { user_id } = req.params;
    const { oldPass, newPass } = req.body;

    try {
      const result = await userModel.updatePassword(user_id, oldPass, newPass);
      res.json({ status: true, message: result.message });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (req, res) => {
    const { user_id } = req.params;
    const { full_name, phone, address } = req.body;

    try {
      const result = await userModel.updateUser(user_id, {
        full_name,
        phone,
        address,
      });
      res.json({ status: true, message: result.message });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  },

  // Xóa người dùng
  deleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      await userModel.deleteUser(id);
      res.json({ status: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  },
};

module.exports = UserController;
