const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/user.route");
const productRoutes = require("./routes/product.route");
const categoryRoutes = require("./routes/category.route");
const cartRoutes = require("./routes/cart.route");
const orderRoutes = require("./routes/order.routes");
const brandRoutes = require("./routes/brand.route");
const uploadRoutes = require("./routes/upload.route");

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        callback(null, true); // Allow requests from any localhost port
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies and credentials to be sent
  })
);
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/uploads", uploadRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cat", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
