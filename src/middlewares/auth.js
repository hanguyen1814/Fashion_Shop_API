const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // 'Bearer <token>'

  if (!token)
    return res.status(401).json({ status: false, message: "Token missing" });

  jwt.verify(token, secret, (err, decoded) => {
    if (err)
      return res.status(403).json({ status: false, message: "Invalid token" });

    req.user = decoded;
    next();
  });
};

const isOwner = (req, res, next) => {
  const targetUserId = parseInt(req.params.user_id);
  if (req.user.role !== "admin" && req.user.user_id !== targetUserId) {
    return res
      .status(403)
      .json({ status: false, message: "Permission denied" });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ status: false, message: "Admin access required" });
  }
  next();
};

module.exports = {
  verifyToken,
  isOwner,
  isAdmin,
};
