const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss[Z]' }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const extra = Object.keys(meta).length ? JSON.stringify(meta) : '';
          return `[${timestamp}] ${level}: ${message} ${extra}`;
        })
      ),
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs/app.log'),
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs/errors.log'),
      level: 'error',
    }),
  ],
});

module.exports = logger;