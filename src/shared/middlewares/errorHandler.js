const { error } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // TypeORM PostgreSQL Unique Violation
  if (err.name === 'QueryFailedError' && err.code === '23505') {
    const detail = err.detail || 'Unique constraint violated';
    return error(res, `Validation Error: ${detail}`, 400, [detail]);
  }

  // Sequelize Unique Constraint / Validation Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => `${e.path} must be unique`);
    return error(res, 'Validation Error: Unique constraint violated', 400, messages);
  }

  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return error(res, 'Validation Error', 400, messages);
  }

  // Business logic errors (we can throw custom error objects with a status property)
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  return error(res, message, statusCode, err.errors || null);
};

module.exports = errorHandler;
