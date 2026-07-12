const { dataSource, Vehicle, Driver, Trip } = require('../../../core/infrastructure/typeorm');

const GetDashboardStats = async () => {
  const vehicleRepository = dataSource.getRepository(Vehicle);
  const driverRepository = dataSource.getRepository(Driver);
  const tripRepository = dataSource.getRepository(Trip);

  // Grouped vehicle counts
  const vehicles = await vehicleRepository
    .createQueryBuilder('vehicle')
    .select('vehicle.status', 'status')
    .addSelect('COUNT(vehicle.id)', 'count')
    .groupBy('vehicle.status')
    .getRawMany();

  const vehicleStats = { Available: 0, 'On Trip': 0, 'In Shop': 0, Retired: 0 };
  vehicles.forEach((v) => {
    vehicleStats[v.status] = Number(v.count) || 0;
  });

  // Grouped driver counts
  const drivers = await driverRepository
    .createQueryBuilder('driver')
    .select('driver.status', 'status')
    .addSelect('COUNT(driver.id)', 'count')
    .groupBy('driver.status')
    .getRawMany();

  const driverStats = { Available: 0, 'On Trip': 0, 'Off Duty': 0, Suspended: 0 };
  drivers.forEach((d) => {
    driverStats[d.status] = Number(d.count) || 0;
  });

  // Trip counts
  const activeTripsCount = await tripRepository.countBy({ status: 'Dispatched' });
  const totalTripsCount = await tripRepository.count();

  return {
    vehicles: vehicleStats,
    drivers: driverStats,
    activeTrips: activeTripsCount,
    totalTrips: totalTripsCount
  };
};

module.exports = GetDashboardStats;
