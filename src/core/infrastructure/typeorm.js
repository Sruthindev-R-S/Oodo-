const AppDataSource = require('../../config/db');
const User = require('../../features/auth/domain/User.model');
const Vehicle = require('../../features/vehicles/domain/Vehicle.model');
const Driver = require('../../features/drivers/domain/Driver.model');
const Trip = require('../../features/trips/domain/Trip.model');
const Maintenance = require('../../features/maintenance/domain/Maintenance.model');
const FuelLog = require('../../features/fuel-logs/domain/FuelLog.model');
const Expense = require('../../features/expenses/domain/Expense.model');

module.exports = {
  dataSource: AppDataSource,
  User,
  Vehicle,
  Driver,
  Trip,
  Maintenance,
  FuelLog,
  Expense
};
