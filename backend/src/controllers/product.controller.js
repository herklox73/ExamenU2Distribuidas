const productService = require('../services/product.service');
const { saveLog } = require('../middlewares/log.middleware');

const getAll  = async (req, res) => res.json(await productService.getAll());
const getById = async (req, res) => res.json(await productService.getById(req.params.id));
const search  = async (req, res) => res.json(await productService.search(req.query.q || ''));

const create = async (req, res) => {
  const product = await productService.create(req.body);
  await saveLog({ event_type:'PRODUCT_CREATE', user_email: req.user.email,
    description:`Producto creado: ${product.product_name}`, ip_address: req.ip });
  res.status(201).json(product);
};

const update = async (req, res) => {
  const product = await productService.update(req.params.id, req.body);
  await saveLog({ event_type:'PRODUCT_UPDATE', user_email: req.user.email,
    description:`Producto actualizado: ID ${req.params.id}`, ip_address: req.ip });
  res.json(product);
};

const remove = async (req, res) => {
  await productService.remove(req.params.id);
  await saveLog({ event_type:'PRODUCT_DELETE', user_email: req.user.email,
    description:`Producto desactivado: ID ${req.params.id}`, ip_address: req.ip });
  res.json({ message: 'Producto desactivado correctamente' });
};

module.exports = { getAll, getById, search, create, update, remove };