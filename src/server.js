require('reflect-metadata');
const argon2 = require('argon2');
const app = require('./app');
const env = require('./config/env');
const { dataSource, User } = require('./core/infrastructure/typeorm');

const startServer = async () => {
  try {
    console.log('Connecting to PostgreSQL database via TypeORM...');
    await dataSource.initialize();
    console.log('Database initialized and synced successfully.');

    // Auto-seed default Admin user for local test / evaluation convenience
    const userRepository = dataSource.getRepository(User);
    const adminCount = await userRepository.count({ where: { role: 'Admin' } });
    if (adminCount === 0) {
      console.log('Seeding default Admin user...');
      const hashedPassword = await argon2.hash('adminpassword');
      const adminUser = userRepository.create({
        username: 'admin',
        password: hashedPassword,
        role: 'Admin'
      });
      await userRepository.save(adminUser);
      console.log('Admin user seeded: admin / adminpassword');
    }

    // Start Express Server
    app.listen(env.PORT, () => {
      console.log(`TransitOps Backend running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
