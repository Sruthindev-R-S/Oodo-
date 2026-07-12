const { EntitySchema } = require('typeorm');

class FuelLog {}

module.exports = new EntitySchema({
  name: 'FuelLog',
  target: FuelLog,
  tableName: 'fuel_logs',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    liters: {
      type: 'float',
      nullable: false
    },
    cost: {
      type: 'float',
      nullable: false
    }
  },
  relations: {
    vehicle: {
      type: 'many-to-one',
      target: 'Vehicle',
      inverseSide: 'fuelLogs',
      joinColumn: { name: 'vehicleId' },
      nullable: false
    },
    trip: {
      type: 'many-to-one',
      target: 'Trip',
      inverseSide: 'fuelLogs',
      joinColumn: { name: 'tripId' },
      nullable: true
    }
  }
});
