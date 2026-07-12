const { dataSource, FuelLog, Vehicle, Trip } = require('../../../core/infrastructure/typeorm');
const { success, created, error } = require('../../../shared/utils/apiResponse');
const buildWhereClause = require('../../../shared/utils/buildWhereClause');

class FuelLogController {
  static async create(req, res, next) {
    try {
      const { vehicleId, tripId, liters, cost } = req.body;

      if (!vehicleId || liters === undefined || cost === undefined) {
        return error(res, 'vehicleId, liters, and cost are required', 400);
      }

      const vehicleRepo = dataSource.getRepository(Vehicle);
      const tripRepo = dataSource.getRepository(Trip);
      const fuelRepo = dataSource.getRepository(FuelLog);

      // Check if vehicle exists
      const vehicle = await vehicleRepo.findOneBy({ id: Number(vehicleId) });
      if (!vehicle) {
        return error(res, `Vehicle with ID ${vehicleId} not found`, 404);
      }

      // Check if trip exists if provided
      if (tripId) {
        const trip = await tripRepo.findOneBy({ id: Number(tripId) });
        if (!trip) {
          return error(res, `Trip with ID ${tripId} not found`, 404);
        }
      }

      const log = fuelRepo.create({
        liters: Number(liters),
        cost: Number(cost),
        vehicle: { id: Number(vehicleId) },
        trip: tripId ? { id: Number(tripId) } : null
      });

      await fuelRepo.save(log);

      return created(res, 'Fuel log created successfully', log);
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const where = buildWhereClause(req.query, ['vehicleId', 'tripId']);
      const repo = dataSource.getRepository(FuelLog);
      const logs = await repo.find({
        where,
        relations: ['vehicle', 'trip']
      });
      return success(res, 'Fuel logs retrieved successfully', logs);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = FuelLogController;
