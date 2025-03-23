const pool = require("../config/db");
const bcrypt = require("bcrypt");

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

  // get me
  getMe: async (id) => {
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

  // update password
  updatePassword: async (id, oldPass, newPass) => {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        return { status: false, error: "User not found" };
      }

      const user = rows[0];
      const isValidPassword = await bcrypt.compare(oldPass, user.password_hash);
      if (!isValidPassword) {
        throw { status: false, message: "Invalid password" };
      }

      const hashedPassword = await bcrypt.hash(newPass, 10);

      const [result] = await pool.query(
        "UPDATE users SET password_hash = ? WHERE user_id = ?",
        [hashedPassword, id]
      );
      return { status: true, message: "Password updated successfully" };
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
      return { status: true, message: "User updated successfully" };
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
