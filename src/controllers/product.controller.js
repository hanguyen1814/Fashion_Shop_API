const Product = require("../models/product.model");

const formatProduct = (product, variants = []) => ({
  product_id: product.product_id,
  category_id: product.category_id,
  brand_id: product.brand_id,
  name: product.name,
  description: product.description,
  price: product.price,
  origin_price: product.origin_price,
  discount: product.discount,
  stock: product.stock,
  has_variants: product.has_variants,
  sold: product.sold,
  image: product.image,
  images: product.images,
  status: product.status,
  created_at: product.created_at,
  updated_at: product.updated_at,
  category: {
    name: product.category_name,
    slug: product.category_slug,
  },
  brand: {
    name: product.brand_name,
    slug: product.brand_slug,
  },
  variants: product.has_variants ? variants : [],
});

const ProductController = {
  getAllProducts: async (req, res) => {
    try {
      const [results] = await Product.getAllProducts();
      res.json(results.map(formatProduct));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const [results] = await Product.getProductById(id);
      if (results.length === 0)
        return res.status(404).json({ message: "Product not found" });

      const product = results[0];
      let variants = [];
      if (product.has_variants) {
        const [variantResults] = await Product.getProductVariants(id);
        variants = variantResults;
      }
      res.json(formatProduct(product, variants));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createProduct: async (req, res) => {
    const { name, description, category_id, brand_id, price, status, images } =
      req.body;
    try {
      await Product.createProduct({
        name,
        description,
        category_id,
        brand_id,
        price,
        status,
        images,
      });
      res.status(201).json({ message: "Product created successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, description, category_id, brand_id, price, status, images } =
      req.body;
    try {
      await Product.updateProduct(id, {
        name,
        description,
        category_id,
        brand_id,
        price,
        status,
        images,
      });
      res.json({ message: "Product updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      await Product.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  searchProducts: async (req, res) => {
    const { id, catid, brandid, limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    try {
      const [results] = await Product.searchProducts({
        id,
        catid,
        brandid,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      const formattedResults = await Promise.all(
        results.map(async (product) => {
          let variants = [];
          if (product.has_variants) {
            const [variantResults] = await Product.getProductVariants(
              product.product_id
            );
            variants = variantResults;
          }
          return formatProduct(product, variants);
        })
      );

      res.json(formattedResults);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = ProductController;
