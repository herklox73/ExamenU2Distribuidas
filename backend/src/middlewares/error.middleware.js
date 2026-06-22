const logger = require('../config/logger');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 404);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class StockError extends AppError {
  constructor(available) {
    super(`Stock insuficiente. Disponible: ${available}`, 409);
  }
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Error interno del servidor';

  logger.error('Error capturado', {
    message: err.message,
    statusCode,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({ error: message });
};

module.exports = { errorHandler, AppError, NotFoundError, ValidationError, StockError };