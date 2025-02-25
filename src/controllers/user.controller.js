const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const SECRET_KEY = "your_secret_key"; // Replace with actual SECRET KEY

const UserController = {
  // Lấy danh sách người dùng
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy thông tin một người dùng
  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const users = await userModel.getUserById(id);
      if (users.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(users[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Đăng ký người dùng
  registerUser: async (req, res) => {
    try {
      const { full_name, email, password, phone, address } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await userModel.createUser({
        full_name,
        email,
        password_hash: hashedPassword,
        phone,
        address,
      });

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Đăng nhập người dùng
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const users = await userModel.loginUser(email);
      if (users.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = users[0];
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "30d" }
      );

      res.json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { full_name, phone, address } = req.body;

    try {
      const result = await userModel.updateUser(id, {
        full_name,
        phone,
        address,
      });
      res.json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa người dùng
  deleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await userModel.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = UserController;
