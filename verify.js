// verify.js
process.env.PORT = 4000;
process.env.NODE_ENV = 'test'; // turns off logging

const app = require('./src/app');
const { dataSource } = require('./src/core/infrastructure/typeorm');

// Helper to clean up database
const cleanDb = async () => {
  try {
    await dataSource.destroy();
  } catch (e) {
    // Ignore
  }
};

let server;

const runTests = async () => {
  console.log('--- STARTING VERIFICATION ---');

  // Initialize DB and sync
  await dataSource.initialize();
  await dataSource.synchronize(true);
  console.log('Database synced for testing.');

  // Start Server
  server = app.listen(4000, () => {
    console.log('Test server running on port 4000.');
  });

  const request = async (method, path, body = null, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`http://localhost:4000${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    return {
      status: res.status,
      data: await res.json()
    };
  };

  try {
    let token = null;

    // 1. Register Dispatcher
    console.log('\n1. Testing Auth - Register Dispatcher...');
    const registerRes = await request('POST', '/api/auth/register', {
      username: 'dispatcher1',
      password: 'password123',
      role: 'Dispatcher'
    });
    if (registerRes.status !== 201 || !registerRes.data.success) {
      throw new Error(`Failed to register user: ${JSON.stringify(registerRes.data)}`);
    }
    console.log('✓ Dispatcher registered successfully.');

    // 2. Login Dispatcher
    console.log('\n2. Testing Auth - Login Dispatcher...');
    const loginRes = await request('POST', '/api/auth/login', {
      username: 'dispatcher1',
      password: 'password123'
    });
    if (loginRes.status !== 200 || !loginRes.data.success) {
      throw new Error(`Failed to login user: ${JSON.stringify(loginRes.data)}`);
    }
    token = loginRes.data.data.token;
    console.log('✓ Login successful, JWT received.');

    // 3. Create Vehicles
    console.log('\n3. Testing Vehicle Creation...');
    const vehicle1Res = await request('POST', '/api/vehicles', {
      registrationNumber: 'KA-01-1234',
      maxLoadCapacity: 5000, // 5 Tons
      acquisitionCost: 20000
    }, token);
    if (vehicle1Res.status !== 201) {
      throw new Error(`Failed to create vehicle: ${JSON.stringify(vehicle1Res.data)}`);
    }
    const vehicle1 = vehicle1Res.data.data;
    console.log(`✓ Vehicle 1 (KA-01-1234) created. ID: ${vehicle1.id}`);

    const vehicle2Res = await request('POST', '/api/vehicles', {
      registrationNumber: 'KA-02-5678',
      maxLoadCapacity: 10000, // 10 Tons
      acquisitionCost: 35000
    }, token);
    const vehicle2 = vehicle2Res.data.data;
    console.log(`✓ Vehicle 2 (KA-02-5678) created. ID: ${vehicle2.id}`);

    // Test unique registration constraint
    const vehicleDupRes = await request('POST', '/api/vehicles', {
      registrationNumber: 'KA-01-1234',
      maxLoadCapacity: 5000,
      acquisitionCost: 20000
    }, token);
    if (vehicleDupRes.status !== 400) {
      throw new Error('Expected 400 Bad Request on duplicate registrationNumber');
    }
    console.log('✓ Unique registration number validation passed.');

    // 4. Create Drivers
    console.log('\n4. Testing Driver Creation...');
    // Driver 1: Valid
    const driver1Res = await request('POST', '/api/drivers', {
      name: 'John Doe',
      licenseNumber: 'DL-999999',
      licenseExpiryDate: '2028-12-31'
    }, token);
    const driver1 = driver1Res.data.data;
    console.log(`✓ Driver 1 (John Doe, Valid License) created. ID: ${driver1.id}`);

    // Driver 2: Expired License
    const driver2Res = await request('POST', '/api/drivers', {
      name: 'Bob Expired',
      licenseNumber: 'DL-888888',
      licenseExpiryDate: '2020-01-01' // expired
    }, token);
    const driver2 = driver2Res.data.data;
    console.log(`✓ Driver 2 (Bob Expired, Expired License) created. ID: ${driver2.id}`);

    // Driver 3: Suspended
    const driver3Res = await request('POST', '/api/drivers', {
      name: 'Sam Suspended',
      licenseNumber: 'DL-777777',
      licenseExpiryDate: '2027-01-01',
      status: 'Suspended'
    }, token);
    const driver3 = driver3Res.data.data;
    console.log(`✓ Driver 3 (Sam Suspended, Status: Suspended) created. ID: ${driver3.id}`);

    // 5. Trip Cargo Weight Constraint Validation
    console.log('\n5. Testing Trip Validation (Cargo Weight)...');
    // Try to create a trip where cargo > vehicle max capacity
    const invalidTripRes = await request('POST', '/api/trips', {
      vehicleId: vehicle1.id,
      driverId: driver1.id,
      cargoWeight: 6000, // exceeds vehicle1 limit of 5000
      revenue: 1000,
      startLocation: 'A',
      endLocation: 'B'
    }, token);
    if (invalidTripRes.status !== 400) {
      throw new Error(`Expected 400 Bad Request for cargo weight limit. Got ${invalidTripRes.status}`);
    }
    console.log('✓ Trip weight limit validation passed (blocked overload).');

    // Create valid trip
    const validTripRes = await request('POST', '/api/trips', {
      vehicleId: vehicle1.id,
      driverId: driver1.id,
      cargoWeight: 4500, // valid
      revenue: 2500,
      startLocation: 'Depot A',
      endLocation: 'Hub B'
    }, token);
    if (validTripRes.status !== 201) {
      throw new Error(`Failed to create valid trip: ${JSON.stringify(validTripRes.data)}`);
    }
    const trip1 = validTripRes.data.data;
    console.log(`✓ Valid Draft Trip created. ID: ${trip1.id}`);

    // 6. The Dispatch Guardrail Verification
    console.log('\n6. Testing Dispatch Guardrails...');
    // Attempt 6a: Dispatch with expired license driver
    const tripExpiredDriverRes = await request('POST', '/api/trips', {
      vehicleId: vehicle2.id,
      driverId: driver2.id, // Bob Expired
      cargoWeight: 1000,
      revenue: 500
    }, token);
    const tripExpiredId = tripExpiredDriverRes.data.data.id;
    const dispatchExpiredRes = await request('POST', `/api/trips/${tripExpiredId}/dispatch`, {}, token);
    if (dispatchExpiredRes.status !== 400) {
      throw new Error(`Expected 400 Bad Request for dispatching expired driver. Got ${dispatchExpiredRes.status}`);
    }
    console.log('✓ Dispatch blocked: Driver license expired guardrail passed.');

    // Attempt 6b: Dispatch with suspended driver
    const tripSuspendedDriverRes = await request('POST', '/api/trips', {
      vehicleId: vehicle2.id,
      driverId: driver3.id, // Sam Suspended
      cargoWeight: 1000,
      revenue: 500
    }, token);
    const tripSuspendedId = tripSuspendedDriverRes.data.data.id;
    const dispatchSuspendedRes = await request('POST', `/api/trips/${tripSuspendedId}/dispatch`, {}, token);
    if (dispatchSuspendedRes.status !== 400) {
      throw new Error(`Expected 400 Bad Request for dispatching suspended driver. Got ${dispatchSuspendedRes.status}`);
    }
    console.log('✓ Dispatch blocked: Driver suspended guardrail passed.');

    // Attempt 6c: Dispatch valid trip (Trip 1)
    console.log('Dispatching valid trip...');
    const dispatchRes = await request('POST', `/api/trips/${trip1.id}/dispatch`, {}, token);
    if (dispatchRes.status !== 200) {
      throw new Error(`Failed to dispatch valid trip: ${JSON.stringify(dispatchRes.data)}`);
    }
    console.log('✓ Valid Trip dispatched successfully.');

    // Check statuses of Vehicle + Driver are updated to 'On Trip'
    const checkVehicleRes = await request('GET', `/api/vehicles/${vehicle1.id}`, null, token);
    const checkDriverRes = await request('GET', `/api/drivers/${driver1.id}`, null, token);
    if (checkVehicleRes.data.data.status !== 'On Trip' || checkDriverRes.data.data.status !== 'On Trip') {
      throw new Error('Vehicle and Driver statuses did not update to On Trip.');
    }
    console.log('✓ Transaction safety check: Vehicle and Driver statuses set to On Trip.');

    // 7. Testing Trip Lifecycle (Complete) + Fuel Log Generation Prompt
    console.log('\n7. Testing Trip Completion...');
    const completeRes = await request('POST', `/api/trips/${trip1.id}/complete`, {}, token);
    if (completeRes.status !== 200) {
      throw new Error(`Failed to complete trip: ${JSON.stringify(completeRes.data)}`);
    }
    const completeData = completeRes.data.data;
    if (completeData.promptFuelLog !== true) {
      throw new Error('Expected promptFuelLog to be true when completing without passing fuel log details.');
    }
    console.log('✓ Trip completed. Auto-prompt fuel log flag returned successfully.');

    // Verify Vehicle & Driver statuses reverted to Available
    const checkVehicleAvail = await request('GET', `/api/vehicles/${vehicle1.id}`, null, token);
    const checkDriverAvail = await request('GET', `/api/drivers/${driver1.id}`, null, token);
    if (checkVehicleAvail.data.data.status !== 'Available' || checkDriverAvail.data.data.status !== 'Available') {
      throw new Error('Vehicle and Driver statuses did not revert to Available.');
    }
    console.log('✓ Transaction safety check: Vehicle and Driver returned to Available.');

    // Log Fuel Log manually now
    console.log('Logging fuel log manually...');
    const logFuelRes = await request('POST', '/api/fuel-logs', {
      vehicleId: vehicle1.id,
      tripId: trip1.id,
      liters: 50,
      cost: 150
    }, token);
    if (logFuelRes.status !== 201) {
      throw new Error(`Failed to log fuel: ${JSON.stringify(logFuelRes.data)}`);
    }
    console.log('✓ Fuel log logged manually.');

    // Create another trip and complete it passing fuel log details in one call
    console.log('Creating second trip to test one-call completion + fuel logging...');
    const trip2Res = await request('POST', '/api/trips', {
      vehicleId: vehicle1.id,
      driverId: driver1.id,
      cargoWeight: 2000,
      revenue: 4000
    }, token);
    const trip2 = trip2Res.data.data;
    await request('POST', `/api/trips/${trip2.id}/dispatch`, {}, token);

    // Complete trip with fuel info in body
    const completeWithFuelRes = await request('POST', `/api/trips/${trip2.id}/complete`, {
      fuelLiters: 80,
      fuelCost: 240
    }, token);
    if (completeWithFuelRes.data.data.promptFuelLog !== false) {
      throw new Error('Expected promptFuelLog to be false when fuel details are supplied.');
    }
    console.log('✓ Completed second trip with automatic fuel log generation.');

    // 8. Maintenance Lock
    console.log('\n8. Testing Maintenance Lock...');
    const maintRes = await request('POST', '/api/maintenance', {
      vehicleId: vehicle1.id,
      description: 'Scheduled Engine Tune-Up',
      cost: 500
    }, token);
    if (maintRes.status !== 201) {
      throw new Error(`Failed to create maintenance: ${JSON.stringify(maintRes.data)}`);
    }
    const maintenanceId = maintRes.data.data.id;
    console.log(`✓ Maintenance record created. ID: ${maintenanceId}`);

    // Verify Vehicle status locked to 'In Shop'
    const checkVehicleInShop = await request('GET', `/api/vehicles/${vehicle1.id}`, null, token);
    if (checkVehicleInShop.data.data.status !== 'In Shop') {
      throw new Error(`Vehicle status is ${checkVehicleInShop.data.data.status}, expected In Shop`);
    }
    console.log('✓ Vehicle status successfully locked to In Shop.');

    // Try to dispatch a trip with vehicle in shop
    const tripBlockedRes = await request('POST', '/api/trips', {
      vehicleId: vehicle1.id, // in shop
      driverId: driver1.id,
      cargoWeight: 1000
    }, token);
    const tripBlockedId = tripBlockedRes.data.data.id;
    const dispatchBlockedRes = await request('POST', `/api/trips/${tripBlockedId}/dispatch`, {}, token);
    if (dispatchBlockedRes.status !== 400) {
      throw new Error(`Expected dispatch to fail for In Shop vehicle. Got ${dispatchBlockedRes.status}`);
    }
    console.log('✓ Dispatch guardrail blocked In Shop vehicle successfully.');

    // Close Maintenance
    console.log('Closing maintenance...');
    const closeMaintRes = await request('PUT', `/api/maintenance/${maintenanceId}/close`, {
      cost: 650 // updated cost
    }, token);
    if (closeMaintRes.status !== 200) {
      throw new Error(`Failed to close maintenance: ${JSON.stringify(closeMaintRes.data)}`);
    }
    console.log('✓ Maintenance closed successfully.');

    // Verify Vehicle status returned to 'Available'
    const checkVehicleReleased = await request('GET', `/api/vehicles/${vehicle1.id}`, null, token);
    if (checkVehicleReleased.data.data.status !== 'Available') {
      throw new Error(`Vehicle status is ${checkVehicleReleased.data.data.status}, expected Available`);
    }
    console.log('✓ Vehicle released and returned to Available.');

    // 9. Dashboard Stats
    console.log('\n9. Testing Dashboard Stats...');
    const statsRes = await request('GET', '/api/dashboard/stats', null, token);
    if (statsRes.status !== 200) {
      throw new Error(`Failed to fetch stats: ${JSON.stringify(statsRes.data)}`);
    }
    const stats = statsRes.data.data;
    console.log('Dashboard stats:', JSON.stringify(stats));
    if (stats.vehicles.Available !== 2 || stats.drivers.Available !== 2) {
      throw new Error('Dashboard stats counts do not match expected status values.');
    }
    console.log('✓ Dashboard stats counts match expected values.');

    // 10. Reports ROI Calculation
    console.log('\n10. Testing ROI Report...');
    const reportRes = await request('GET', '/api/reports/vehicle-cost', null, token);
    if (reportRes.status !== 200) {
      throw new Error(`Failed to generate ROI report: ${JSON.stringify(reportRes.data)}`);
    }
    const report = reportRes.data.data;
    console.log('ROI Report:', JSON.stringify(report));

    // Vehicle 1 math:
    // Revenue: trip1 (2500) + trip2 (4000) = 6500
    // Maintenance: 650 (since closed with 650)
    // Fuel: manual log (150) + auto log (240) = 390
    // Acquisition Cost: 20000
    // Expected ROI = [6500 - (650 + 390)] / 20000 = (6500 - 1040) / 20000 = 5460 / 20000 = 0.2730
    const v1Report = report.find((r) => r.vehicleId === vehicle1.id);
    if (!v1Report) {
      throw new Error('Vehicle 1 not found in report.');
    }
    if (v1Report.roi !== 0.273) {
      throw new Error(`Expected Vehicle 1 ROI to be 0.2730. Got ${v1Report.roi}`);
    }
    console.log('✓ Vehicle 1 ROI matches exact formula: 0.2730.');

    console.log('\n======================================');
    console.log('✓ ALL TRANSITOPS API VERIFICATIONS PASSED.');
    console.log('======================================');

    server.close();
    await cleanDb();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ VERIFICATION FAILURE:', err.message);
    if (server) server.close();
    await cleanDb();
    process.exit(1);
  }
};

runTests();
