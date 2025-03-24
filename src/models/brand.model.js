const db = require("../config/db");

const Brand = {};

Brand.getAll = async () => {
  try {
    const [results] = await db.query(`
      SELECT * FROM brands;
    `);
    return { status: true, data: results };
  } catch (err) {
    console.error("Error fetching all brands:", err);
    return { status: false, error: "Failed to fetch brands" };
  }
};

Brand.getBrandById = async (brandId) => {
  try {
    const [results] = await db.query(
      `
      SELECT * FROM brands WHERE brand_id = ?;
      `,
      [brandId]
    );
    if (results.length === 0) {
      return { status: false, error: "Brand not found" };
    }
    return { status: true, data: results[0] };
  } catch (err) {
    console.error("Error fetching brand by ID:", err);
    return { status: false, error: "Failed to fetch brand" };
  }
};

Brand.createBrand = async (brand) => {
  const { name, slug, description, logo } = brand;
  try {
    const [results] = await db.query(
      `
      INSERT INTO brands (name, slug, description, logo) VALUES (?, ?, ?, ?);
      `,
      [name, slug, description, logo || null]
    );
    return { status: true, data: { brand_id: results.insertId } };
  } catch (err) {
    console.error("Error creating brand:", err);
    return { status: false, error: "Failed to create brand" };
  }
};

Brand.updateBrand = async (brandId, brand) => {
  const { name, slug, description, logo } = brand;
  try {
    const [results] = await db.query(
      `
      UPDATE brands SET name = ?, slug = ?, description = ?, logo = ? WHERE brand_id = ?;
      `,
      [name, slug, description, logo || null, brandId]
    );
    if (results.affectedRows === 0) {
      return { status: false, error: "Brand not found or no changes made" };
    }
    return { status: true, message: "Brand updated successfully" };
  } catch (err) {
    console.error("Error updating brand:", err);
    return { status: false, error: "Failed to update brand" };
  }
};

Brand.deleteBrand = async (brandId) => {
  try {
    const [results] = await db.query(
      `
      DELETE FROM brands WHERE brand_id = ?;
      `,
      [brandId]
    );
    if (results.affectedRows === 0) {
      return { status: false, error: "Brand not found" };
    }
    return { status: true, message: "Brand deleted successfully" };
  } catch (err) {
    console.error("Error deleting brand:", err);
    return { status: false, error: "Failed to delete brand" };
  }
};

module.exports = Brand;
