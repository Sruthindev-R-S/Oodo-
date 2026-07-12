const { dataSource, Trip, Vehicle, Driver } = require('../../../core/infrastructure/typeorm');

const CreateTrip = async ({ vehicleId, driverId, cargoWeight, revenue, startLocation, endLocation }) => {
  if (!vehicleId || !driverId || cargoWeight === undefined) {
    const error = new Error('vehicleId, driverId, and cargoWeight are required');
    error.status = 400;
    throw error;
  }

  const tripRepository = dataSource.getRepository(Trip);
  const vehicleRepository = dataSource.getRepository(Vehicle);
  const driverRepository = dataSource.getRepository(Driver);

  // Find Vehicle
  const vehicle = await vehicleRepository.findOne({ where: { id: Number(vehicleId) } });
  if (!vehicle) {
    const error = new Error(`Vehicle with ID ${vehicleId} not found`);
    error.status = 404;
    throw error;
  }

  // Find Driver
  const driver = await driverRepository.findOne({ where: { id: Number(driverId) } });
  if (!driver) {
    const error = new Error(`Driver with ID ${driverId} not found`);
    error.status = 404;
    throw error;
  }

  // Rule: Cargo Weight <= Vehicle Max Load Capacity
  if (cargoWeight > vehicle.maxLoadCapacity) {
    const error = new Error(
      `Cargo Weight (${cargoWeight} kg) exceeds Vehicle Max Load Capacity (${vehicle.maxLoadCapacity} kg)`
    );
    error.status = 400;
    throw error;
  }

  // Create the Trip in Draft status
  const trip = tripRepository.create({
    cargoWeight: Number(cargoWeight),
    revenue: revenue !== undefined ? Number(revenue) : 0,
    startLocation,
    endLocation,
    status: 'Draft',
    vehicle: { id: vehicle.id },
    driver: { id: driver.id }
  });

  await tripRepository.save(trip);
  return trip;
};

module.exports = CreateTrip;
