const { EntitySchema } = require('typeorm');

class Driver {
  isLicenseExpired() {
    if (!this.licenseExpiryDate) return true;
    const today = new Date();
    const expiry = new Date(this.licenseExpiryDate);
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    return expiry < today;
  }
}

module.exports = new EntitySchema({
  name: 'Driver',
  target: Driver,
  tableName: 'drivers',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    name: {
      type: 'varchar',
      nullable: false
    },
    licenseNumber: {
      type: 'varchar',
      unique: true,
      nullable: false
    },
    licenseExpiryDate: {
      type: 'date',
      nullable: false
    },
    status: {
      type: 'varchar',
      nullable: false,
      default: 'Available'
    }
  },
  relations: {
    trips: {
      type: 'one-to-many',
      target: 'Trip',
      inverseSide: 'driver'
    }
  }
});
