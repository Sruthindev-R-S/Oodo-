const { dataSource, Trip, Vehicle, Driver } = require('../../../core/infrastructure/typeorm');

const CancelTrip = async (tripId) => {
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

    const unallowedStatuses = ['Completed', 'Cancelled'];
    if (unallowedStatuses.includes(trip.status)) {
      const error = new Error(`Trip cannot be cancelled because it is already ${trip.status}`);
      error.status = 400;
      throw error;
    }

    const vehicle = await queryRunner.manager.findOne(Vehicle, { where: { id: trip.vehicle.id } });
    const driver = await queryRunner.manager.findOne(Driver, { where: { id: trip.driver.id } });

    trip.status = 'Cancelled';
    await queryRunner.manager.save(trip);

    if (vehicle) {
      vehicle.status = 'Available';
      await queryRunner.manager.save(vehicle);
    }

    if (driver) {
      driver.status = 'Available';
      await queryRunner.manager.save(driver);
    }

    await queryRunner.commitTransaction();
    return trip;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

module.exports = CancelTrip;
