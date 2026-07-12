const { EntitySchema } = require('typeorm');

class Vehicle {}

module.exports = new EntitySchema({
  name: 'Vehicle',
  target: Vehicle,
  tableName: 'vehicles',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    registrationNumber: {
      type: 'varchar',
      unique: true,
      nullable: false
    },
    status: {
      type: 'varchar',
      nullable: false,
      default: 'Available'
    },
    maxLoadCapacity: {
      type: 'float',
      nullable: false
    },
    acquisitionCost: {
      type: 'float',
      nullable: false
    }
  },
  relations: {
    trips: {
      type: 'one-to-many',
      target: 'Trip',
      inverseSide: 'vehicle'
    },
    maintenances: {
      type: 'one-to-many',
      target: 'Maintenance',
      inverseSide: 'vehicle'
    },
    fuelLogs: {
      type: 'one-to-many',
      target: 'FuelLog',
      inverseSide: 'vehicle'
    },
    expenses: {
      type: 'one-to-many',
      target: 'Expense',
      inverseSide: 'vehicle'
    }
  }
});
