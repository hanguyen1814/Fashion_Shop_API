const pool = require("../config/db"); // Import MySQL connection

const User = {
  // Lấy tất cả người dùng
  getAllUsers: async () => {
    try {
      const [rows] = await pool.query("SELECT * FROM users");
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Lấy một người dùng theo ID
  getUserById: async (id) => {
    try {
      const [rows] = await pool.query(
        "SELECT user_id, full_name, email, phone, address, role, status, created_at FROM users WHERE user_id = ?",
        [id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Tạo người dùng mới
  createUser: async (userData) => {
    const { full_name, email, password_hash, phone, address } = userData;
    try {
      const [result] = await pool.query(
        "INSERT INTO users (full_name, email, password_hash, phone, address) VALUES (?, ?, ?, ?, ?)",
        [full_name, email, password_hash, phone, address]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (id, userData) => {
    const { full_name, phone, address } = userData;
    try {
      const [result] = await pool.query(
        "UPDATE users SET full_name = ?, phone = ?, address = ?, updated_at = NOW() WHERE user_id = ?",
        [full_name, phone, address, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Xóa người dùng
  deleteUser: async (id) => {
    try {
      const [result] = await pool.query("DELETE FROM users WHERE user_id = ?", [
        id,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Kiểm tra đăng nhập
  loginUser: async (email) => {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = User;
