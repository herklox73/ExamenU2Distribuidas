const productRepo = require('../repositories/product.repository');
const { NotFoundError, ValidationError } = require('../middlewares/error.middleware');

const getAll = () => productRepo.findAll();

const getById = async (id) => {
  const product = await productRepo.findById(id);
  if (!product) throw new NotFoundError('Producto');
  return product;
};

const search = (term) => productRepo.search(term);

const create = async (data) => {
  if (!data.product_name) throw new ValidationError('El nombre es requerido');
  if (data.unit_price <= 0) throw new ValidationError('El precio debe ser mayor a 0');
  if (data.units_in_stock < 0) throw new ValidationError('El stock no puede ser negativo');
  return productRepo.create(data);
};

const update = async (id, data) => {
  const existing = await productRepo.findById(id);
  if (!existing) throw new NotFoundError('Producto');
  return productRepo.update(id, data);
};

const remove = async (id) => {
  const existing = await productRepo.findById(id);
  if (!existing) throw new NotFoundError('Producto');
  return productRepo.softDelete(id);
};

module.exports = { getAll, getById, search, create, update, remove };