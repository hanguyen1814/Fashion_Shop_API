const Brand = require("../models/brand.model");
const path = require("path");

const BrandController = {};

BrandController.getAllBrands = async (req, res) => {
  try {
    const result = await Brand.getAll();
    if (result.status) {
      return res.status(200).json(result.data);
    } else {
      return res.status(500).json({ message: result.error });
    }
  } catch (error) {
    console.error("Error in getAllBrands:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

BrandController.getBrandById = async (req, res) => {
  try {
    const { brandId } = req.params;
    const result = await Brand.getBrandById(brandId);
    if (result.status) {
      return res.status(200).json(result.data);
    } else {
      return res.status(404).json({ message: result.error });
    }
  } catch (error) {
    console.error("Error in getBrandById:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

BrandController.createBrand = async (req, res) => {
  try {
    const brandData = req.body;
    if (req.file) {
      brandData.logo = path.join("uploads", req.file.filename);
    }
    const result = await Brand.createBrand(brandData);
    if (result.status) {
      return res.status(201).json({
        message: "Brand created successfully",
        brand_id: result.data.brand_id,
      });
    } else {
      return res.status(400).json({ message: result.error });
    }
  } catch (error) {
    console.error("Error in createBrand:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

BrandController.updateBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const brandData = req.body;
    if (req.file) {
      brandData.logo = path.join("uploads", req.file.filename);
    }
    const result = await Brand.updateBrand(brandId, brandData);
    if (result.status) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(404).json({ message: result.error });
    }
  } catch (error) {
    console.error("Error in updateBrand:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

BrandController.deleteBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const result = await Brand.deleteBrand(brandId);
    if (result.status) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(404).json({ message: result.error });
    }
  } catch (error) {
    console.error("Error in deleteBrand:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = BrandController;
