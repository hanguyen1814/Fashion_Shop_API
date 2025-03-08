require("dotenv").config();
const mysql = require("mysql2/promise");
const xlsx = require("xlsx");
const fs = require("fs");

// Kết nối đến MySQL
async function connectDB() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "shop_thoi_trang",
  });
}

// Đọc file Excel
function readExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); // Chuyển đổi thành JSON
}

const categoryMapping = {
  "polo-nu-tokyo": 11036482,
  "polo-nam-tokyo": 11036481,
  "ao-giu-nhiet-tokyo": 11036480,
  "ao-chong-nang-tokyo": 11036479,
};

async function importData(filePath) {
  const connection = await connectDB();

  const data = readExcel(filePath);

  for (const row of data) {
    const categoryId = categoryMapping[row.description] || null;
    const brandId = 12;

    const sql = `
            INSERT INTO products 
            (category_id, brand_id, name, description, price, origin_price, discount, stock, sold, image, images) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?);`;

    const values = [
      categoryId,
      brandId,
      row.name || null,
      row.description || null,
      row.price || null,
      row.origin_price || null,
      row.discount || null,
      row.stock || 1000,
      row.sold || 0,
      row.image || null,
      row.images || null,
    ];

    try {
      await connection.execute(sql, values);
      console.log(`Inserted: ${row.name}`);
    } catch (error) {
      console.error(`Error inserting ${row.name}:`, error.message);
    }
  }

  await connection.end();
  console.log("✅ Import completed!");
}

// Chạy hàm import với file Excel
const filePath =
  "C:Users/teamk/OneDrive/Máy tính/Shop thoi trang/TokyoLife.xlsx";
importData(filePath);
