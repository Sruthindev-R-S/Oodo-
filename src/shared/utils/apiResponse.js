const success = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const created = (res, message, data = {}) => {
  return success(res, message, data, 201);
};

const error = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

module.exports = {
  success,
  created,
  error
};
