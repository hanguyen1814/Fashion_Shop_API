const db = require("../config/db");
const bcrypt = require("bcrypt");

class User {
  static async getAll() {
    try {
      const [rows] = await db.query("SELECT * FROM users");
      return rows;
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }

  static async getUserById(id) {
    try {
      const [rows] = await db.query(
        "SELECT user_id, full_name, email, phone, address, role FROM users WHERE user_id = ?",
        [id]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error("Failed to fetch user");
    }
  }

  static async createUser(userData) {
    try {
      const { full_name, email, password_hash, phone, address, role } =
        userData;
      const hashedPassword = await bcrypt.hash(password_hash, 10); // Mã hóa mật khẩu

      const [result] = await db.query(
        "INSERT INTO users (full_name, email, password_hash, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)",
        [full_name, email, hashedPassword, phone, address, role || "customer"]
      );
      return result;
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  static async updateUser(id, userData) {
    try {
      const { full_name, email, phone, address, role } = userData;
      const [result] = await db.query(
        "UPDATE users SET full_name = ?, email = ?, phone = ?, address = ?, role = ? WHERE user_id = ?",
        [full_name, email, phone, address, role, id]
      );
      return result;
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  static async deleteUser(id) {
    try {
      const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [
        id,
      ]);
      return result;
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }
}

module.exports = User;
