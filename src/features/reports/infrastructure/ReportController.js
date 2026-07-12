const GetVehicleCostReport = require('../application/GetVehicleCostReport');
const { success } = require('../../../shared/utils/apiResponse');

class ReportController {
  static async getVehicleCostReport(req, res, next) {
    try {
      const { vehicleId } = req.query;
      const report = await GetVehicleCostReport(vehicleId);
      return success(res, 'Vehicle cost report generated successfully', report);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReportController;
