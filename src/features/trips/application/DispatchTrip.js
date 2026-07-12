const { dataSource, Trip, Vehicle, Driver } = require('../../../core/infrastructure/typeorm');

const DispatchTrip = async (tripId) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const trip = await queryRunner.manager.findOne(Trip, {
      where: { id: Number(tripId) },
      relations: ['vehicle', 'driver']
    });

    if (!trip) {
      const error = new Error(`Trip with ID ${tripId} not found`);
      error.status = 404;
      throw error;
    }

    if (trip.status !== 'Draft') {
      const error = new Error(`Only Draft trips can be dispatched. Current status: ${trip.status}`);
      error.status = 400;
      throw error;
    }

    const vehicle = await queryRunner.manager.findOne(Vehicle, { where: { id: trip.vehicle.id } });
    if (!vehicle) {
      const error = new Error(`Vehicle with ID ${trip.vehicle.id} not found`);
      error.status = 404;
      throw error;
    }

    const driver = await queryRunner.manager.findOne(Driver, { where: { id: trip.driver.id } });
    if (!driver) {
      const error = new Error(`Driver with ID ${trip.driver.id} not found`);
      error.status = 404;
      throw error;
    }

    // Guardrail Check: License Expiry
    // In EntitySchema, the class functions are preserved on class instances loaded by TypeORM!
    if (driver.isLicenseExpired()) {
      const error = new Error('Cannot dispatch trip: Driver license is expired');
      error.status = 400;
      throw error;
    }

    // Guardrail Check: Driver Status
    if (driver.status === 'Suspended') {
      const error = new Error('Cannot dispatch trip: Driver is Suspended');
      error.status = 400;
      throw error;
    }
    if (driver.status !== 'Available') {
      const error = new Error(`Cannot dispatch trip: Driver is not Available (current status: ${driver.status})`);
      error.status = 400;
      throw error;
    }

    // Guardrail Check: Vehicle Status
    if (vehicle.status === 'In Shop' || vehicle.status === 'Retired') {
      const error = new Error(`Cannot dispatch trip: Vehicle is ${vehicle.status}`);
      error.status = 400;
      throw error;
    }
    if (vehicle.status !== 'Available') {
      const error = new Error(`Cannot dispatch trip: Vehicle is not Available (current status: ${vehicle.status})`);
      error.status = 400;
      throw error;
    }

    // Update statuses inside transaction
    trip.status = 'Dispatched';
    await queryRunner.manager.save(trip);

    vehicle.status = 'On Trip';
    await queryRunner.manager.save(vehicle);

    driver.status = 'On Trip';
    await queryRunner.manager.save(driver);

    await queryRunner.commitTransaction();
    return trip;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

module.exports = DispatchTrip;
