const { dataSource, Driver } = require('../../../core/infrastructure/typeorm');
const { success, created, error } = require('../../../shared/utils/apiResponse');
const buildWhereClause = require('../../../shared/utils/buildWhereClause');

class DriverController {
  static async create(req, res, next) {
    try {
      const { name, licenseNumber, licenseExpiryDate, status } = req.body;
      const repo = dataSource.getRepository(Driver);

      const driver = repo.create({
        name,
        licenseNumber,
        licenseExpiryDate,
        status
      });

      await repo.save(driver);
      return created(res, 'Driver created successfully', driver);
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const where = buildWhereClause(
        req.query,
        ['status'],
        { fields: ['name', 'licenseNumber'] }
      );
      const repo = dataSource.getRepository(Driver);
      const drivers = await repo.find({ where });

      const formattedDrivers = drivers.map((driver) => ({
        ...driver,
        isLicenseExpired: driver.isLicenseExpired()
      }));

      return success(res, 'Drivers retrieved successfully', formattedDrivers);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const repo = dataSource.getRepository(Driver);
      const driver = await repo.findOneBy({ id: Number(id) });
      if (!driver) {
        return error(res, 'Driver not found', 404);
      }
      return success(res, 'Driver retrieved successfully', {
        ...driver,
        isLicenseExpired: driver.isLicenseExpired()
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DriverController;
