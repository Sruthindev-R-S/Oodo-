const CreateTrip = require('../application/CreateTrip');
const DispatchTrip = require('../application/DispatchTrip');
const CompleteTrip = require('../application/CompleteTrip');
const CancelTrip = require('../application/CancelTrip');
const { dataSource, Trip } = require('../../../core/infrastructure/typeorm');
const { success, created, error } = require('../../../shared/utils/apiResponse');
const buildWhereClause = require('../../../shared/utils/buildWhereClause');

class TripController {
  static async create(req, res, next) {
    try {
      const { vehicleId, driverId, cargoWeight, revenue, startLocation, endLocation } = req.body;
      const trip = await CreateTrip({
        vehicleId,
        driverId,
        cargoWeight,
        revenue,
        startLocation,
        endLocation
      });
      return created(res, 'Trip created successfully', trip);
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const where = buildWhereClause(
        req.query,
        ['status', 'vehicleId', 'driverId']
      );
      const repo = dataSource.getRepository(Trip);
      const trips = await repo.find({
        where,
        relations: ['vehicle', 'driver']
      });
      return success(res, 'Trips retrieved successfully', trips);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const repo = dataSource.getRepository(Trip);
      const trip = await repo.findOne({
        where: { id: Number(id) },
        relations: ['vehicle', 'driver']
      });
      if (!trip) {
        return error(res, 'Trip not found', 404);
      }
      return success(res, 'Trip retrieved successfully', trip);
    } catch (err) {
      next(err);
    }
  }

  static async dispatch(req, res, next) {
    try {
      const { id } = req.params;
      const trip = await DispatchTrip(id);
      return success(res, 'Trip dispatched successfully', trip);
    } catch (err) {
      next(err);
    }
  }

  static async complete(req, res, next) {
    try {
      const { id } = req.params;
      const { fuelLiters, fuelCost } = req.body;

      const fuelData =
        fuelLiters !== undefined && fuelCost !== undefined
          ? { liters: fuelLiters, cost: fuelCost }
          : null;

      const result = await CompleteTrip(id, fuelData);
      return success(
        res,
        result.promptFuelLog ? 'Trip completed, fuel log required' : 'Trip completed successfully',
        result
      );
    } catch (err) {
      next(err);
    }
  }

  static async cancel(req, res, next) {
    try {
      const { id } = req.params;
      const trip = await CancelTrip(id);
      return success(res, 'Trip cancelled successfully', trip);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TripController;
