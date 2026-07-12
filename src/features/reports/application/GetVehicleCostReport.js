const { dataSource, Vehicle } = require('../../../core/infrastructure/typeorm');

const GetVehicleCostReport = async (vehicleId = null) => {
  const vehicleRepository = dataSource.getRepository(Vehicle);

  const query = vehicleRepository
    .createQueryBuilder('vehicle')
    .leftJoinAndSelect('vehicle.trips', 'trip', 'trip.status = :tripStatus', { tripStatus: 'Completed' })
    .leftJoinAndSelect('vehicle.maintenances', 'maintenance', 'maintenance.status = :maintStatus', { maintStatus: 'Closed' })
    .leftJoinAndSelect('vehicle.fuelLogs', 'fuelLog');

  if (vehicleId) {
    query.where('vehicle.id = :vehicleId', { vehicleId: Number(vehicleId) });
  }

  const vehicles = await query.getMany();

  return vehicles.map((v) => {
    const totalRevenue = v.trips ? v.trips.reduce((sum, t) => sum + (t.revenue || 0), 0) : 0;
    const totalMaintenance = v.maintenances ? v.maintenances.reduce((sum, m) => sum + (m.cost || 0), 0) : 0;
    const totalFuel = v.fuelLogs ? v.fuelLogs.reduce((sum, f) => sum + (f.cost || 0), 0) : 0;

    const acquisitionCost = v.acquisitionCost > 0 ? v.acquisitionCost : 1; // Prevent division by zero
    const roi = (totalRevenue - (totalMaintenance + totalFuel)) / acquisitionCost;

    return {
      vehicleId: v.id,
      registrationNumber: v.registrationNumber,
      status: v.status,
      acquisitionCost: v.acquisitionCost,
      totalRevenue,
      totalMaintenanceCost: totalMaintenance,
      totalFuelCost: totalFuel,
      roi: Number(roi.toFixed(4))
    };
  });
};

module.exports = GetVehicleCostReport;
