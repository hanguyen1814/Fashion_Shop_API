const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/user.route");
const productRoutes = require("./routes/product.route");
const categoryRoutes = require("./routes/category.route");
const cartRoutes = require("./routes/cart.route");
const orderRoutes = require("./routes/order.routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cat", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
