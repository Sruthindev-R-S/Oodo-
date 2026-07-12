const { EntitySchema } = require('typeorm');

class Expense {}

module.exports = new EntitySchema({
  name: 'Expense',
  target: Expense,
  tableName: 'expenses',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    amount: {
      type: 'float',
      nullable: false
    },
    category: {
      type: 'varchar',
      nullable: false
    },
    description: {
      type: 'varchar',
      nullable: true
    }
  },
  relations: {
    vehicle: {
      type: 'many-to-one',
      target: 'Vehicle',
      inverseSide: 'expenses',
      joinColumn: { name: 'vehicleId' },
      nullable: false
    },
    trip: {
      type: 'many-to-one',
      target: 'Trip',
      inverseSide: 'expenses',
      joinColumn: { name: 'tripId' },
      nullable: true
    }
  }
});
