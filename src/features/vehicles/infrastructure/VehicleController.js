const { dataSource, Vehicle } = require('../../../core/infrastructure/typeorm');
const { success, created, error } = require('../../../shared/utils/apiResponse');
const buildWhereClause = require('../../../shared/utils/buildWhereClause');

class VehicleController {
  static async create(req, res, next) {
    try {
      const { registrationNumber, status, maxLoadCapacity, acquisitionCost } = req.body;
      const repo = dataSource.getRepository(Vehicle);

      const vehicle = repo.create({
        registrationNumber,
        status,
        maxLoadCapacity: maxLoadCapacity !== undefined ? Number(maxLoadCapacity) : undefined,
        acquisitionCost: acquisitionCost !== undefined ? Number(acquisitionCost) : undefined
      });

      await repo.save(vehicle);
      return created(res, 'Vehicle created successfully', vehicle);
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const where = buildWhereClause(
        req.query,
        ['status'],
        { fields: ['registrationNumber'] }
      );
      const repo = dataSource.getRepository(Vehicle);
      const vehicles = await repo.find({ where });
      return success(res, 'Vehicles retrieved successfully', vehicles);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const repo = dataSource.getRepository(Vehicle);
      const vehicle = await repo.findOneBy({ id: Number(id) });
      if (!vehicle) {
        return error(res, 'Vehicle not found', 404);
      }
      return success(res, 'Vehicle retrieved successfully', vehicle);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = VehicleController;
