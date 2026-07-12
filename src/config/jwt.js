const jwt = require('jsonwebtoken');
const env = require('./env');

const signToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken
};
