const pool = require('../config/db');
const productRepo = require('../repositories/product.repository');
const { ValidationError, StockError, NotFoundError } = require('../middlewares/error.middleware');
const { saveLog } = require('../middlewares/log.middleware');

const purchase = async ({ product_id, quantity, userEmail, ip }) => {
  if (!product_id || !quantity) throw new ValidationError('product_id y quantity son requeridos');
  if (quantity <= 0) throw new ValidationError('La cantidad debe ser mayor a 0');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const product = await productRepo.findById(product_id);
    if (!product) throw new NotFoundError('Producto');
    if (product.discontinued === 1 || product.discontinued === true) 
    throw new ValidationError('Producto descontinuado');
    if (product.units_in_stock < quantity) throw new StockError(product.units_in_stock);

    const userResult = await client.query(
      'SELECT user_id FROM users WHERE email = $1', [userEmail]
    );
    const userId = userResult.rows[0]?.user_id;

    const total = product.unit_price * quantity;
    const orderResult = await client.query(
    'INSERT INTO purchase_orders (user_id, total) VALUES ($1, $2) RETURNING *',
      [userId, total]
    );
    const order = orderResult.rows[0];

    await client.query(
      'INSERT INTO purchase_order_details (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
      [order.order_id, product_id, quantity, product.unit_price]
    );

    await productRepo.decreaseStock(product_id, quantity, client);
    await client.query('COMMIT');

    await saveLog({
      event_type: 'PURCHASE',
      user_email: userEmail,
      description: `Compra: ${quantity}x ${product.product_name} — Total: $${total}`,
      ip_address: ip,
    });

    return { order, product: product.product_name, quantity, total };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { purchase };