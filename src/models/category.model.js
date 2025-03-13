const db = require("../config/db");

const Category = {
  async getAllCat() {
    const sql = `
      WITH RECURSIVE CategoryHierarchy AS (
          SELECT 
              c.category_id,
              c.brand_id,
              c.name,
              c.slug,
              c.image,
              c.description,
              c.parent_id,
              c.status,
              JSON_ARRAY() AS children
          FROM categories c
          WHERE c.parent_id IS NULL

          UNION ALL

          SELECT 
              c.category_id,
              c.brand_id,
              c.name,
              c.slug,
              c.image,
              c.description,
              c.parent_id,
              c.status,
              JSON_ARRAY()
          FROM categories c
          INNER JOIN CategoryHierarchy ch ON c.parent_id = ch.category_id
      )
      SELECT * FROM CategoryHierarchy
      ORDER BY parent_id IS NULL DESC, parent_id, category_id;
    `;

    try {
      const [results] = await db.query(sql);

      const categoryMap = {};
      const rootCategories = [];

      results.forEach((cat) => {
        categoryMap[cat.category_id] = { ...cat, children: [] };
      });

      results.forEach((cat) => {
        if (cat.parent_id) {
          categoryMap[cat.parent_id]?.children.push(
            categoryMap[cat.category_id]
          );
        } else {
          rootCategories.push(categoryMap[cat.category_id]);
        }
      });

      return rootCategories;
    } catch (err) {
      throw err;
    }
  },

  async getById(id) {
    const sql = `
      WITH RECURSIVE CategoryHierarchy AS (
          SELECT 
              c.category_id,
              c.brand_id,
              c.name,
              c.slug,
              c.image,
              c.description,
              c.parent_id,
              c.status
          FROM categories c
          WHERE c.category_id = ?

          UNION ALL

          SELECT 
              c.category_id,
              c.brand_id,
              c.name,
              c.slug,
              c.image,
              c.description,
              c.parent_id,
              c.status
          FROM categories c
          INNER JOIN CategoryHierarchy ch ON c.category_id = ch.parent_id
      )
      SELECT * FROM CategoryHierarchy;
    `;

    const sqlChildren = `
      SELECT 
          category_id, brand_id, name, slug, image, description, parent_id, status
      FROM categories
      WHERE parent_id = ?;
    `;

    try {
      const [categoryResults] = await db.query(sql, [id]);

      if (categoryResults.length === 0) return null;

      const [childrenResults] = await db.query(sqlChildren, [id]);

      const category = categoryResults[0];

      const catTree = categoryResults.reverse().map((cat) => ({
        category_id: cat.category_id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
      }));

      return {
        ...category,
        children: childrenResults,
        cat_tree: catTree,
      };
    } catch (err) {
      throw err;
    }
  },

  async getBySlug(slug) {
    const sql = `
      SELECT 
          c.category_id,
          c.brand_id,
          c.name,
          c.slug,
          c.image,
          c.description,
          c.parent_id,
          c.status
      FROM categories c
      WHERE c.slug = ?;
    `;

    try {
      const [results] = await db.query(sql, [slug]);
      return results[0];
    } catch (err) {
      throw err;
    }
  },
};

// (async () => {
//   console.log(await Category.getById(1));
// })();

module.exports = Category;
