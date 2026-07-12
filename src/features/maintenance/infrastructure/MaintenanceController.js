const CreateMaintenance = require('../application/CreateMaintenance');
const CloseMaintenance = require('../application/CloseMaintenance');
const { dataSource, Maintenance } = require('../../../core/infrastructure/typeorm');
const { success, created, error } = require('../../../shared/utils/apiResponse');
const buildWhereClause = require('../../../shared/utils/buildWhereClause');

class MaintenanceController {
  static async create(req, res, next) {
    try {
      const { vehicleId, description, cost } = req.body;
      const maintenance = await CreateMaintenance({ vehicleId, description, cost });
      return created(res, 'Maintenance record created and vehicle locked In Shop', maintenance);
    } catch (err) {
      next(err);
    }
  }

  static async close(req, res, next) {
    try {
      const { id } = req.params;
      const { cost } = req.body;
      const maintenance = await CloseMaintenance(id, { cost });
      return success(res, 'Maintenance record closed and vehicle released', maintenance);
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const where = buildWhereClause(req.query, ['status', 'vehicleId']);
      const repo = dataSource.getRepository(Maintenance);
      const records = await repo.find({
        where,
        relations: ['vehicle']
      });
      return success(res, 'Maintenance records retrieved successfully', records);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MaintenanceController;
