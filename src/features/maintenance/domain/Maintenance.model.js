const { EntitySchema } = require('typeorm');

class Maintenance {}

module.exports = new EntitySchema({
  name: 'Maintenance',
  target: Maintenance,
  tableName: 'maintenances',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    description: {
      type: 'varchar',
      nullable: false
    },
    status: {
      type: 'varchar',
      nullable: false,
      default: 'Open'
    },
    cost: {
      type: 'float',
      nullable: false,
      default: 0
    }
  },
  relations: {
    vehicle: {
      type: 'many-to-one',
      target: 'Vehicle',
      inverseSide: 'maintenances',
      joinColumn: { name: 'vehicleId' },
      nullable: false
    }
  }
});
