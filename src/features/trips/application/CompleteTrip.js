const { dataSource, Trip, Vehicle, Driver, FuelLog } = require('../../../core/infrastructure/typeorm');

const CompleteTrip = async (tripId, fuelData = null) => {
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

    if (trip.status !== 'Dispatched') {
      const error = new Error(`Only Dispatched trips can be completed. Current status: ${trip.status}`);
      error.status = 400;
      throw error;
    }

    const vehicle = await queryRunner.manager.findOne(Vehicle, { where: { id: trip.vehicle.id } });
    const driver = await queryRunner.manager.findOne(Driver, { where: { id: trip.driver.id } });

    trip.status = 'Completed';
    await queryRunner.manager.save(trip);

    if (vehicle) {
      vehicle.status = 'Available';
      await queryRunner.manager.save(vehicle);
    }

    if (driver) {
      driver.status = 'Available';
      await queryRunner.manager.save(driver);
    }

    let fuelLog = null;
    if (fuelData && fuelData.liters !== undefined && fuelData.cost !== undefined) {
      fuelLog = queryRunner.manager.create(FuelLog, {
        liters: Number(fuelData.liters),
        cost: Number(fuelData.cost),
        vehicle: { id: trip.vehicle.id },
        trip: { id: trip.id }
      });
      await queryRunner.manager.save(fuelLog);
    }

    await queryRunner.commitTransaction();

    return {
      trip,
      fuelLog,
      promptFuelLog: !fuelLog,
      promptMessage: fuelLog
        ? null
        : `Trip completed successfully. Please record the fuel log details (liters, cost) for Vehicle ${
            vehicle ? vehicle.registrationNumber : trip.vehicle.id
          } on Trip ${trip.id}.`
    };
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

module.exports = CompleteTrip;
