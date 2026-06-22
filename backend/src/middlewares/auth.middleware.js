const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const logger = require('../config/logger');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Acceso sin token', { ip: req.ip, path: req.path });
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const revoked = await pool.query(
      'SELECT id FROM revoked_tokens WHERE jti = $1',
      [decoded.jti]
    );

    if (revoked.rows.length > 0) {
      logger.warn('Token revocado usado', { email: decoded.email });
      return res.status(401).json({ error: 'Token revocado. Inicia sesión nuevamente.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;