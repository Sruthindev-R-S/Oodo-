require('reflect-metadata');
const { DataSource } = require('typeorm');
const env = require('./env');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true, // Auto-create tables for development
  logging: env.NODE_ENV === 'development',
  entities: [
    require('../features/auth/domain/User.model'),
    require('../features/vehicles/domain/Vehicle.model'),
    require('../features/drivers/domain/Driver.model'),
    require('../features/trips/domain/Trip.model'),
    require('../features/maintenance/domain/Maintenance.model'),
    require('../features/fuel-logs/domain/FuelLog.model'),
    require('../features/expenses/domain/Expense.model')
  ]
});

module.exports = AppDataSource;
