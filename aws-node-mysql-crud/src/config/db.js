const mysql = require('mysql2/promise');
const env = require('./env');
const logger = require('../utils/logger');

const pool = mysql.createPool({
  host: env.dbHost,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then((connection) => {
    logger.info('MySQL pool connected');
    connection.release();
  })
  .catch((err) => {
    logger.error('MySQL connection failed', { stack: err.stack });
  });

module.exports = pool;
