const { dataSource, Expense, Vehicle, Trip } = require('../../../core/infrastructure/typeorm');
const { success, created, error } = require('../../../shared/utils/apiResponse');
const buildWhereClause = require('../../../shared/utils/buildWhereClause');

class ExpenseController {
  static async create(req, res, next) {
    try {
      const { vehicleId, tripId, amount, category, description } = req.body;

      if (!vehicleId || amount === undefined || !category) {
        return error(res, 'vehicleId, amount, and category are required', 400);
      }

      const vehicleRepo = dataSource.getRepository(Vehicle);
      const tripRepo = dataSource.getRepository(Trip);
      const expenseRepo = dataSource.getRepository(Expense);

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

      const expense = expenseRepo.create({
        amount: Number(amount),
        category,
        description,
        vehicle: { id: Number(vehicleId) },
        trip: tripId ? { id: Number(tripId) } : null
      });

      await expenseRepo.save(expense);

      return created(res, 'Expense logged successfully', expense);
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const where = buildWhereClause(req.query, ['vehicleId', 'tripId', 'category']);
      const repo = dataSource.getRepository(Expense);
      const expenses = await repo.find({
        where,
        relations: ['vehicle', 'trip']
      });
      return success(res, 'Expenses retrieved successfully', expenses);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ExpenseController;
