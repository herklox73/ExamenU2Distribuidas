const orderService = require('../services/order.service');

const purchase = async (req, res) => {
  const result = await orderService.purchase({
    ...req.body,
    userEmail: req.user.email,
    ip: req.ip,
  });
  res.status(201).json({ message: 'Compra realizada con éxito', ...result });
};

module.exports = { purchase };