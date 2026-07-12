const { verifyToken } = require('../../config/jwt');
const { error } = require('../utils/apiResponse');

const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return error(res, 'Not authorized, token missing', 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user info (id, username, role)
    next();
  } catch (err) {
    return error(res, 'Not authorized, invalid token', 401);
  }
};

module.exports = protect;
