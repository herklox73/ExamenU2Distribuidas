const pool = require('../config/db');

const findAll = async () => {
  const { rows } = await pool.query(`
    SELECT p.*, c.category_name, s.company_name AS supplier_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
    WHERE p.discontinued = 0
    ORDER BY p.product_id
  `);
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT p.*, c.category_name, s.company_name AS supplier_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.category_id
     LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
     WHERE p.product_id = $1`,
    [id]
  );
  return rows[0] || null;
};

const search = async (term) => {
  const { rows } = await pool.query(
    `SELECT p.*, c.category_name, s.company_name AS supplier_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.category_id
     LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
     WHERE LOWER(p.product_name) LIKE LOWER($1) AND p.discontinued = 0`,
    [`%${term}%`]
  );
  return rows;
};

const create = async ({ product_name, supplier_id, category_id, unit_price, units_in_stock }) => {
  const { rows } = await pool.query(
    `INSERT INTO products (product_name, supplier_id, category_id, unit_price, units_in_stock)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [
      product_name,
      supplier_id ? parseInt(supplier_id) : null,
      category_id ? parseInt(category_id) : null,
      parseFloat(unit_price),
      parseInt(units_in_stock)
    ]
  );
  return rows[0];
};

const update = async (id, fields) => {
  const { product_name, unit_price, units_in_stock, category_id } = fields;
  const { rows } = await pool.query(
    `UPDATE products
     SET product_name   = COALESCE($1, product_name),
         unit_price     = COALESCE($2, unit_price),
         units_in_stock = COALESCE($3, units_in_stock),
         category_id    = COALESCE($4, category_id)
     WHERE product_id = $5 RETURNING *`,
    [
      product_name || null,
      unit_price ? parseFloat(unit_price) : null,
      units_in_stock ? parseInt(units_in_stock) : null,
      category_id ? parseInt(category_id) : null,
      id
    ]
  );
  return rows[0] || null;
};
const softDelete = async (id) => {
  const { rows } = await pool.query(
    `UPDATE products SET discontinued = 1 WHERE product_id = $1 RETURNING *`,
    [id]
  );
  return rows[0] || null;
};

const decreaseStock = async (id, quantity, client) => {
  const db = client || pool;
  const { rows } = await db.query(
    `UPDATE products SET units_in_stock = units_in_stock - $1
     WHERE product_id = $2 RETURNING *`,
    [quantity, id]
  );
  return rows[0] || null;
};

module.exports = { findAll, findById, search, create, update, softDelete, decreaseStock };