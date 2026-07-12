const { EntitySchema } = require('typeorm');

class Trip {}

module.exports = new EntitySchema({
  name: 'Trip',
  target: Trip,
  tableName: 'trips',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    cargoWeight: {
      type: 'float',
      nullable: false
    },
    status: {
      type: 'varchar',
      nullable: false,
      default: 'Draft'
    },
    revenue: {
      type: 'float',
      nullable: false,
      default: 0
    },
    startLocation: {
      type: 'varchar',
      nullable: true
    },
    endLocation: {
      type: 'varchar',
      nullable: true
    }
  },
  relations: {
    vehicle: {
      type: 'many-to-one',
      target: 'Vehicle',
      inverseSide: 'trips',
      joinColumn: { name: 'vehicleId' },
      nullable: false
    },
    driver: {
      type: 'many-to-one',
      target: 'Driver',
      inverseSide: 'trips',
      joinColumn: { name: 'driverId' },
      nullable: false
    },
    fuelLogs: {
      type: 'one-to-many',
      target: 'FuelLog',
      inverseSide: 'trip'
    },
    expenses: {
      type: 'one-to-many',
      target: 'Expense',
      inverseSide: 'trip'
    }
  }
});
