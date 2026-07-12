const { dataSource, Maintenance, Vehicle } = require('../../../core/infrastructure/typeorm');

const CreateMaintenance = async ({ vehicleId, description, cost }) => {
  if (!vehicleId || !description) {
    const error = new Error('vehicleId and description are required');
    error.status = 400;
    throw error;
  }

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const vehicle = await queryRunner.manager.findOne(Vehicle, { where: { id: Number(vehicleId) } });
    if (!vehicle) {
      const error = new Error(`Vehicle with ID ${vehicleId} not found`);
      error.status = 404;
      throw error;
    }

    if (vehicle.status === 'Retired') {
      const error = new Error('Cannot perform maintenance on a Retired vehicle');
      error.status = 400;
      throw error;
    }

    const maintenance = queryRunner.manager.create(Maintenance, {
      description,
      cost: cost !== undefined ? Number(cost) : 0,
      status: 'Open',
      vehicle: { id: vehicle.id }
    });
    await queryRunner.manager.save(maintenance);

    vehicle.status = 'In Shop';
    await queryRunner.manager.save(vehicle);

    await queryRunner.commitTransaction();
    return maintenance;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

module.exports = CreateMaintenance;
