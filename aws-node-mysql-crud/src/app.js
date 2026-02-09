const express = require('express');
const path = require('path');
const logger = require('./utils/logger');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;
