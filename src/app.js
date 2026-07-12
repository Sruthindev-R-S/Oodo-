const express = require('express');
const errorHandler = require('./shared/middlewares/errorHandler');

// Route imports
const authRoutes = require('./features/auth/infrastructure/auth.routes');
const vehicleRoutes = require('./features/vehicles/infrastructure/vehicle.routes');
const driverRoutes = require('./features/drivers/infrastructure/driver.routes');
const tripRoutes = require('./features/trips/infrastructure/trip.routes');
const maintenanceRoutes = require('./features/maintenance/infrastructure/maintenance.routes');
const fuelLogRoutes = require('./features/fuel-logs/infrastructure/fuelLog.routes');
const expenseRoutes = require('./features/expenses/infrastructure/expense.routes');
const dashboardRoutes = require('./features/dashboard/infrastructure/dashboard.routes');
const reportRoutes = require('./features/reports/infrastructure/report.routes');

const path = require('path');
const app = express();

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Feature Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/fuel-logs', fuelLogRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
