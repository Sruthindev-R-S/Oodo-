const GetDashboardStats = require('../application/GetDashboardStats');
const { success } = require('../../../shared/utils/apiResponse');

class DashboardController {
  static async getStats(req, res, next) {
    try {
      const stats = await GetDashboardStats();
      return success(res, 'Dashboard statistics retrieved successfully', stats);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DashboardController;
