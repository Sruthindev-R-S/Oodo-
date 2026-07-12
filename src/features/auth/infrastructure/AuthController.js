const RegisterUser = require('../application/RegisterUser');
const LoginUser = require('../application/LoginUser');
const { success, created } = require('../../../shared/utils/apiResponse');

class AuthController {
  static async register(req, res, next) {
    try {
      const { username, password, role } = req.body;
      const user = await RegisterUser({ username, password, role });
      return created(res, 'User registered successfully', user);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const data = await LoginUser({ username, password });
      return success(res, 'Login successful', data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
