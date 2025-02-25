const mysql = require("mysql2");
const dotenv = require("dotenv");
const fs = require("fs");

const customEnvPath = "/home/flhwndf/Fashion_Shop/.env";

if (fs.existsSync(customEnvPath)) {
  dotenv.config({ path: customEnvPath });
  console.log(`🟢 Đã tải file .env từ: ${customEnvPath}`);
} else {
  dotenv.config();
  console.log(
    "🟡 Không tìm thấy file .env tùy chỉnh, sử dụng file .env mặc định."
  );
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "shop_thoi_trang",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
