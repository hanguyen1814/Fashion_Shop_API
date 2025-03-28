const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: false, message: "No image uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ status: true, url: imageUrl });
});

module.exports = router;
