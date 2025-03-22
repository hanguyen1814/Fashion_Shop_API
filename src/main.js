const mysql = require("mysql2/promise");

// Hàm bỏ dấu tiếng Việt
const removeDiacritics = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

(async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // sửa nếu có mật khẩu
    database: "shop_thoi_trang",
  });

  try {
    // 1. Thêm cột mới nếu chưa có
    await connection.execute(`
      ALTER TABLE products
      ADD COLUMN name_khong_dau VARCHAR(255)
    `);
    console.log("✅ Đã thêm cột 'name_khong_dau'");
  } catch (err) {
    if (err.code === "ER_DUP_FIELDNAME") {
      console.log("⚠️ Cột 'name_khong_dau' đã tồn tại, bỏ qua bước thêm cột.");
    } else {
      throw err;
    }
  }

  // 2. Lấy toàn bộ product_id và name
  const [rows] = await connection.execute(
    `SELECT product_id, name FROM products`
  );

  for (const row of rows) {
    const nameKhongDau = removeDiacritics(row.name);
    await connection.execute(
      `UPDATE products SET name_khong_dau = ? WHERE product_id = ?`,
      [nameKhongDau, row.product_id]
    );
    console.log(`→ Đã cập nhật: ${row.name} → ${nameKhongDau}`);
  }

  console.log("🎉 Đã cập nhật toàn bộ tên không dấu.");
  await connection.end();
})();
