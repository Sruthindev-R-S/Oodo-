const { error } = require('../utils/apiResponse');

const rbac = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Not authenticated', 401);
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role)) {
      return error(res, 'Forbidden: Insufficient permissions', 403);
    }

    next();
  };
};

module.exports = rbac;
