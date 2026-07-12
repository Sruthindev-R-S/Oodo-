const { dataSource, Maintenance, Vehicle } = require('../../../core/infrastructure/typeorm');

const CloseMaintenance = async (maintenanceId, { cost } = {}) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const maintenance = await queryRunner.manager.findOne(Maintenance, {
      where: { id: Number(maintenanceId) },
      relations: ['vehicle']
    });

    if (!maintenance) {
      const error = new Error(`Maintenance record with ID ${maintenanceId} not found`);
      error.status = 404;
      throw error;
    }

    if (maintenance.status === 'Closed') {
      const error = new Error('Maintenance record is already closed');
      error.status = 400;
      throw error;
    }

    const vehicle = await queryRunner.manager.findOne(Vehicle, { where: { id: maintenance.vehicle.id } });
    if (!vehicle) {
      const error = new Error(`Associated vehicle with ID ${maintenance.vehicle.id} not found`);
      error.status = 404;
      throw error;
    }

    maintenance.status = 'Closed';
    if (cost !== undefined) {
      maintenance.cost = Number(cost);
    }
    await queryRunner.manager.save(maintenance);

    if (vehicle.status !== 'Retired') {
      vehicle.status = 'Available';
      await queryRunner.manager.save(vehicle);
    }

    await queryRunner.commitTransaction();
    return maintenance;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

module.exports = CloseMaintenance;
