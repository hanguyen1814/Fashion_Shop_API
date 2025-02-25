const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv");

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

const userRoutes = require("./routes/user.route");
const productRoutes = require("./routes/product.route");
const categoryRoutes = require("./routes/category.route");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cat", categoryRoutes);

module.exports = app;
