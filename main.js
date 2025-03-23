const fs = require("fs");
const Product = require("./src/models/product.model");

const filePath =
  "E:\\Workspace\\Project Codes\\web\\Shop thoi trang\\API\\data.json"; // Đổi thành tên file JSON của bạn

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("❌ Lỗi đọc file JSON:", err);
    return;
  }

  try {
    const dataObj = JSON.parse(data).items;
    dataObj.forEach(async (item) => {
      try {
        const itemBasic = item.item_basic;
        const product = {};
        variants = [];
        const colorOptions = itemBasic.tier_variations?.[0]?.options || null;
        const colorImages = itemBasic.tier_variations?.[0]?.images || null;
        const size = itemBasic.tier_variations?.[1]?.options || null;

        product.category_id = 12;
        product.brand_id = 18;
        product.name = itemBasic.name;
        product.description = "";
        product.price = itemBasic.price_min / 100000;
        product.origin_price = itemBasic.price_max / 100000;
        product.discount = itemBasic.raw_discount;
        product.stock = itemBasic.stock;
        product.sold = itemBasic.sold;
        product.image = `https://down-vn.img.susercontent.com/file/${itemBasic.image}`;
        product.images = itemBasic.images.map(
          (img) => `https://down-vn.img.susercontent.com/file/${img}`
        );

        if (colorOptions && size) {
          colorOptions.forEach((color, index) => {
            size.forEach((size) => {
              variants.push({
                color_name: color,
                size_name: size,
                price: product.price,
                origin_price: product.origin_price,
                discount: product.discount,
                stock: 100,
                sold: 50,
                image: `https://down-vn.img.susercontent.com/file/${
                  colorImages?.[index] || ""
                }`,
              });
            });
          });
        }

        product.variants = variants;

        const add = await Product.create(product);
        // console.log("✅ Thêm sản phẩm:", add);
      } catch (error) {
        console.error("❌ Lỗi thêm sản phẩm:", error);
      }
    });
  } catch (error) {
    console.error("❌ Lỗi parse JSON:", error);
  }
});
