// TransitOps Local Storage Database & Service Layer - Mockup Dark Theme

const KEY_VEHICLES = 'transitops_vehicles';
const KEY_DRIVERS = 'transitops_drivers';
const KEY_TRIPS = 'transitops_trips';
const KEY_MAINTENANCE = 'transitops_maintenance';
const KEY_EXPENSES = 'transitops_expenses';

// Pre-populated seed data matching the new rich categories list
const SEED_VEHICLES = [
  { id: 'Van-05', name: 'Mercedes-Benz Sprinter', type: 'Utility Van', maxCapacity: 500, odometer: 12000, acquisitionCost: 45000, status: 'Available', rating: 4.8, price: 30, region: 'North', modelYear: 2023, enginePower: '170 HP', maxSpeed: '160 km/h', fuelType: 'Diesel' },
  { id: 'TRX-12', name: 'Volvo FH Globetrotter', type: 'Flatbed Truck', maxCapacity: 5000, odometer: 45000, acquisitionCost: 115000, status: 'On Trip', rating: 5.0, price: 85, region: 'East', modelYear: 2022, enginePower: '500 HP', maxSpeed: '90 km/h', fuelType: 'Diesel' },
  { id: 'MINI-08', name: 'Toyota Camry Hybrid', type: 'Delivery Vehicle', maxCapacity: 400, odometer: 82000, acquisitionCost: 28000, status: 'On Trip', rating: 4.2, price: 15, region: 'South', modelYear: 2021, enginePower: '208 HP', maxSpeed: '180 km/h', fuelType: 'Hybrid' },
  { id: 'Van-01', name: 'Ford Transit Custom', type: 'Cargo Van', maxCapacity: 800, odometer: 19500, acquisitionCost: 35000, status: 'Available', rating: 4.5, price: 25, region: 'West', modelYear: 2022, enginePower: '130 HP', maxSpeed: '150 km/h', fuelType: 'Diesel' },
  { id: 'Truck-04', name: 'Scania R500 V8', type: 'Dump Truck', maxCapacity: 7500, odometer: 64000, acquisitionCost: 135000, status: 'Retired', rating: 3.9, price: 95, region: 'North', modelYear: 2019, enginePower: '500 HP', maxSpeed: '90 km/h', fuelType: 'Diesel' },
  { id: 'Van-03', name: 'Volkswagen Crafter', type: 'Refrigerated Van', maxCapacity: 650, odometer: 8500, acquisitionCost: 38000, status: 'In Shop', rating: 4.9, price: 28, region: 'East', modelYear: 2023, enginePower: '140 HP', maxSpeed: '155 km/h', fuelType: 'Diesel' }
];

const SEED_DRIVERS = [
  { id: 'driver-alex', name: 'Alex Mercer', licenseNumber: 'DL-938210', licenseCategory: 'Class A', licenseExpiryDate: '2028-11-20', contactNumber: '+1 555-0199', safetyScore: 4.9, status: 'Available' },
  { id: 'driver-john', name: 'John Smith', licenseNumber: 'DL-382910', licenseCategory: 'Class B', licenseExpiryDate: '2026-08-05', contactNumber: '+1 555-0123', safetyScore: 4.6, status: 'On Trip' },
  { id: 'driver-priya', name: 'Priya Patel', licenseNumber: 'DL-481920', licenseCategory: 'Class B', licenseExpiryDate: '2027-04-15', contactNumber: '+1 555-0144', safetyScore: 5.0, status: 'On Trip' },
  { id: 'driver-jane', name: 'Jane Doe', licenseNumber: 'DL-104928', licenseCategory: 'Class A', licenseExpiryDate: '2026-05-10', contactNumber: '+1 555-0167', safetyScore: 3.2, status: 'Suspended' },
  { id: 'driver-sarah', name: 'Sarah Connor', licenseNumber: 'DL-555000', licenseCategory: 'Class C', licenseExpiryDate: '2025-12-31', contactNumber: '+1 555-0555', safetyScore: 4.8, status: 'Off Duty' }
];

const SEED_TRIPS = [
  { id: 'TR001', source: 'Kaba, Kogi State', destination: 'Lokoja Bypass', vehicleId: 'Van-05', driverId: 'driver-alex', cargoWeight: 450, distance: 85, status: 'Dispatched', date: '2026-07-12', eta: '45 min' },
  { id: 'TR002', source: 'Warehouse North', destination: 'Port Distribution Center', vehicleId: 'TRX-12', driverId: 'driver-john', cargoWeight: 4200, distance: 120, status: 'Completed', date: '2026-07-11', finalOdometer: 45000, fuelConsumed: 15, revenue: 350, eta: '—' },
  { id: 'TR003', source: 'HQ Depot West', destination: 'Central Market', vehicleId: 'MINI-08', driverId: 'driver-priya', cargoWeight: 380, distance: 45, status: 'Dispatched', date: '2026-07-12', eta: '1h 10m' },
  { id: 'TR004', source: 'Operations Center', destination: 'Northern Outpost', vehicleId: '', driverId: '', cargoWeight: 0, distance: 150, status: 'Draft', date: '2026-07-12', eta: 'Awaiting vehicle' }
];

const SEED_MAINTENANCE = [
  { id: 'Maint-201', vehicleId: 'Van-03', issue: 'Tire replacement and alignment service', status: 'In Shop', cost: 180, date: '2026-07-10', closedDate: null }
];

const SEED_EXPENSES = [
  { id: 'exp-1', vehicleId: 'TRX-12', type: 'Fuel', amount: 90, date: '2026-07-12', detail: '45 Liters' },
  { id: 'exp-2', vehicleId: 'Van-03', type: 'Maintenance', amount: 180, date: '2026-07-10', detail: 'Tire replacement' }
];

// Helper to initialize database in local storage if not present
const initStorage = () => {
  // Always write seed data first if Oodo- key is missing or to refresh structure
  if (!localStorage.getItem(KEY_VEHICLES)) {
    localStorage.setItem(KEY_VEHICLES, JSON.stringify(SEED_VEHICLES));
  }
  if (!localStorage.getItem(KEY_DRIVERS)) {
    localStorage.setItem(KEY_DRIVERS, JSON.stringify(SEED_DRIVERS));
  }
  if (!localStorage.getItem(KEY_TRIPS)) {
    localStorage.setItem(KEY_TRIPS, JSON.stringify(SEED_TRIPS));
  }
  if (!localStorage.getItem(KEY_MAINTENANCE)) {
    localStorage.setItem(KEY_MAINTENANCE, JSON.stringify(SEED_MAINTENANCE));
  }
  if (!localStorage.getItem(KEY_EXPENSES)) {
    localStorage.setItem(KEY_EXPENSES, JSON.stringify(SEED_EXPENSES));
  }
};

initStorage();

const getData = (key) => JSON.parse(localStorage.getItem(key));
const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const api = {
  // --- VEHICLES ---
  getVehicles: () => getData(KEY_VEHICLES),
  
  saveVehicle: (vehicle) => {
    const vehicles = api.getVehicles();
    const index = vehicles.findIndex(v => v.id.toLowerCase() === vehicle.id.toLowerCase());
    
    if (index > -1) {
      vehicles[index] = { ...vehicles[index], ...vehicle };
    } else {
      const exists = vehicles.some(v => v.id.toLowerCase() === vehicle.id.toLowerCase());
      if (exists) throw new Error(`Vehicle registration ID '${vehicle.id}' is already registered.`);
      vehicles.push({
        status: 'Available',
        rating: 5.0,
        odometer: 0,
        modelYear: new Date().getFullYear(),
        enginePower: '160 HP',
        maxSpeed: '150 km/h',
        fuelType: 'Diesel',
        ...vehicle
      });
    }
    saveData(KEY_VEHICLES, vehicles);
    return vehicle;
  },

  // --- DRIVERS ---
  getDrivers: () => getData(KEY_DRIVERS),
  
  saveDriver: (driver) => {
    const drivers = api.getDrivers();
    if (driver.id) {
      const index = drivers.findIndex(d => d.id === driver.id);
      if (index > -1) drivers[index] = { ...drivers[index], ...driver };
    } else {
      const newDriver = {
        id: `driver-${Date.now()}`,
        status: 'Available',
        safetyScore: 5.0,
        ...driver
      };
      drivers.push(newDriver);
    }
    saveData(KEY_DRIVERS, drivers);
    return driver;
  },

  // --- TRIPS ---
  getTrips: () => getData(KEY_TRIPS),
  
  createTrip: (tripData) => {
    const trips = api.getTrips();
    const newTrip = {
      id: `TR00${trips.length + 1}`,
      status: 'Draft',
      date: new Date().toISOString().split('T')[0],
      eta: 'Awaiting vehicle',
      ...tripData
    };
    trips.push(newTrip);
    saveData(KEY_TRIPS, trips);
    return newTrip;
  },

  dispatchTrip: (tripId) => {
    const trips = api.getTrips();
    const vehicles = api.getVehicles();
    const drivers = api.getDrivers();

    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) throw new Error('Trip not found');
    const trip = trips[tripIndex];

    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    const driver = drivers.find(d => d.id === trip.driverId);

    // Validations
    if (!vehicle || vehicle.status !== 'Available') {
      throw new Error(`Vehicle ${trip.vehicleId} is not available.`);
    }
    if (!driver || driver.status !== 'Available') {
      throw new Error(`Driver ${driver?.name || trip.driverId} is busy or suspended.`);
    }
    const expiry = new Date(driver.licenseExpiryDate);
    if (expiry < new Date()) {
      throw new Error(`Driver ${driver.name} has an expired license.`);
    }

    // Dispatch states
    trip.status = 'Dispatched';
    trip.eta = 'Calculating...';
    vehicle.status = 'On Trip';
    if (driver) driver.status = 'On Trip';

    saveData(KEY_TRIPS, trips);
    saveData(KEY_VEHICLES, vehicles);
    saveData(KEY_DRIVERS, drivers);

    return trip;
  },

  completeTrip: (tripId, finalOdometer, fuelConsumed, revenue) => {
    const trips = api.getTrips();
    const vehicles = api.getVehicles();
    const drivers = api.getDrivers();
    const expenses = api.getExpenses();

    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) throw new Error('Trip not found');
    const trip = trips[tripIndex];

    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    const driver = drivers.find(d => d.id === trip.driverId);

    if (finalOdometer < vehicle.odometer) {
      throw new Error(`Final odometer (${finalOdometer} km) cannot be less than initial (${vehicle.odometer} km).`);
    }

    trip.status = 'Completed';
    trip.finalOdometer = Number(finalOdometer);
    trip.fuelConsumed = Number(fuelConsumed);
    trip.revenue = Number(revenue);
    trip.eta = '—';

    vehicle.odometer = Number(finalOdometer);
    vehicle.status = 'Available';
    if (driver) driver.status = 'Available';

    // Log fuel cost
    const fuelCost = Number(fuelConsumed) * 2;
    expenses.push({
      id: `exp-${Date.now()}`,
      vehicleId: vehicle.id,
      type: 'Fuel',
      amount: fuelCost,
      date: new Date().toISOString().split('T')[0],
      detail: `${fuelConsumed} Liters consumed during ${trip.id}`
    });

    saveData(KEY_TRIPS, trips);
    saveData(KEY_VEHICLES, vehicles);
    if (driver) saveData(KEY_DRIVERS, drivers);
    saveData(KEY_EXPENSES, expenses);

    return trip;
  },

  cancelTrip: (tripId) => {
    const trips = api.getTrips();
    const vehicles = api.getVehicles();
    const drivers = api.getDrivers();

    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) throw new Error('Trip not found');
    const trip = trips[tripIndex];

    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    const driver = drivers.find(d => d.id === trip.driverId);

    if (trip.status === 'Dispatched') {
      if (vehicle) vehicle.status = 'Available';
      if (driver) driver.status = 'Available';
    }

    trip.status = 'Cancelled';
    trip.eta = '—';

    saveData(KEY_TRIPS, trips);
    if (vehicle) saveData(KEY_VEHICLES, vehicles);
    if (driver) saveData(KEY_DRIVERS, drivers);

    return trip;
  },

  // --- MAINTENANCE ---
  getMaintenanceLogs: () => getData(KEY_MAINTENANCE),
  
  createMaintenance: (vehicleId, issue) => {
    const maintenance = api.getMaintenanceLogs();
    const vehicles = api.getVehicles();
    const vehicle = vehicles.find(v => v.id === vehicleId);

    if (!vehicle) throw new Error('Vehicle not found');
    if (vehicle.status === 'On Trip') throw new Error('Vehicle is currently dispatched on a trip.');

    vehicle.status = 'In Shop';

    const newLog = {
      id: `Maint-${200 + maintenance.length + 1}`,
      vehicleId,
      issue,
      status: 'In Shop',
      cost: 0,
      date: new Date().toISOString().split('T')[0],
      closedDate: null
    };

    maintenance.push(newLog);
    saveData(KEY_MAINTENANCE, maintenance);
    saveData(KEY_VEHICLES, vehicles);
    return newLog;
  },

  closeMaintenance: (maintId, cost) => {
    const maintenance = api.getMaintenanceLogs();
    const vehicles = api.getVehicles();
    const expenses = api.getExpenses();

    const log = maintenance.find(m => m.id === maintId);
    const vehicle = vehicles.find(v => v.id === log.vehicleId);

    log.status = 'Completed';
    log.cost = Number(cost);
    log.closedDate = new Date().toISOString().split('T')[0];

    if (vehicle.status !== 'Retired') {
      vehicle.status = 'Available';
    }

    expenses.push({
      id: `exp-${Date.now()}`,
      vehicleId: vehicle.id,
      type: 'Maintenance',
      amount: Number(cost),
      date: new Date().toISOString().split('T')[0],
      detail: `Resolved maintenance: ${log.issue}`
    });

    saveData(KEY_MAINTENANCE, maintenance);
    saveData(KEY_VEHICLES, vehicles);
    saveData(KEY_EXPENSES, expenses);
    return log;
  },

  // --- EXPENSES ---
  getExpenses: () => getData(KEY_EXPENSES),
  addExpense: (expense) => {
    const expenses = api.getExpenses();
    const newExpense = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...expense,
      amount: Number(expense.amount)
    };
    expenses.push(newExpense);
    saveData(KEY_EXPENSES, expenses);
    return newExpense;
  },

  // --- DASHBOARD QUERY AND METRICS ---
  getDashboardKPIs: (filters = {}) => {
    const vehicles = api.getVehicles();
    const drivers = api.getDrivers();
    const trips = api.getTrips();
    const expenses = api.getExpenses();

    // 1. Apply multi-dropdown filters
    let filteredVehicles = vehicles;
    
    // Filter by Region
    if (filters.region && filters.region !== 'All') {
      filteredVehicles = filteredVehicles.filter(v => v.region === filters.region);
    }
    
    // Filter by Vehicle Type
    if (filters.type && filters.type !== 'All') {
      filteredVehicles = filteredVehicles.filter(v => v.type === filters.type);
    }
    
    // Filter by Status: Available, Not Available (On Trip + Retired), Maintenance (In Shop)
    if (filters.status && filters.status !== 'All') {
      if (filters.status === 'Available') {
        filteredVehicles = filteredVehicles.filter(v => v.status === 'Available');
      } else if (filters.status === 'Not Available') {
        filteredVehicles = filteredVehicles.filter(v => v.status === 'On Trip' || v.status === 'Retired');
      } else if (filters.status === 'Maintenance') {
        filteredVehicles = filteredVehicles.filter(v => v.status === 'In Shop');
      }
    }

    const filteredIds = new Set(filteredVehicles.map(v => v.id));
    const filteredTrips = trips.filter(t => t.vehicleId === '' || filteredIds.has(t.vehicleId));

    // Stats calculations
    const totalVehiclesCount = filteredVehicles.length;
    const activeVehicles = filteredVehicles.filter(v => v.status === 'On Trip').length;
    const availableVehicles = filteredVehicles.filter(v => v.status === 'Available').length;
    const inShopVehicles = filteredVehicles.filter(v => v.status === 'In Shop').length;
    const retiredVehicles = filteredVehicles.filter(v => v.status === 'Retired').length;

    const activeTrips = filteredTrips.filter(t => t.status === 'Dispatched').length;
    const pendingTrips = filteredTrips.filter(t => t.status === 'Draft').length;

    // Drivers on duty
    const driversOnDuty = drivers.filter(d => d.status === 'Available' || d.status === 'On Trip').length;

    // Fleet utilization (Active / Total Non-Retired)
    const totalNonRetired = totalVehiclesCount - retiredVehicles;
    const fleetUtilization = totalNonRetired > 0 
      ? Math.round((activeVehicles / totalNonRetired) * 100) 
      : 0;

    // Total expenses & revenues
    const vehicleExpenses = expenses.filter(e => filteredIds.has(e.vehicleId));
    const totalMaintenanceCost = vehicleExpenses.filter(e => e.type === 'Maintenance').reduce((acc, curr) => acc + curr.amount, 0);
    const totalFuelCost = vehicleExpenses.filter(e => e.type === 'Fuel').reduce((acc, curr) => acc + curr.amount, 0);
    const totalRevenue = filteredTrips.filter(t => t.status === 'Completed').reduce((acc, curr) => acc + (curr.revenue || 0), 0);

    // Distribution stats for progress bars
    const totalStatusCount = totalVehiclesCount > 0 ? totalVehiclesCount : 1;
    const statusRatios = {
      availablePct: Math.round((availableVehicles / totalStatusCount) * 100),
      ontripPct: Math.round((activeVehicles / totalStatusCount) * 100),
      inshopPct: Math.round((inShopVehicles / totalStatusCount) * 100),
      retiredPct: Math.round((retiredVehicles / totalStatusCount) * 100),
    };

    return {
      totalVehicles: totalVehiclesCount,
      activeVehicles,
      availableVehicles,
      inShopVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization,
      totalMaintenanceCost,
      totalFuelCost,
      totalRevenue,
      netProfit: totalRevenue - (totalMaintenanceCost + totalFuelCost),
      statusRatios
    };
  },

  getAnalyticsData: () => {
    const expenses = api.getExpenses();
    const byType = expenses.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + curr.amount;
      return acc;
    }, {});

    return {
      expenseDistribution: [
        { name: 'Fuel', value: byType['Fuel'] || 0, color: '#007AFF' },
        { name: 'Maintenance', value: byType['Maintenance'] || 0, color: '#FF9500' },
        { name: 'Tolls', value: byType['Tolls'] || 0, color: '#34C759' }
      ],
      weeklyTrend: [
        { day: 'Mon', cost: 120, trips: 2 },
        { day: 'Tue', cost: 150, trips: 3 },
        { day: 'Wed', cost: 90, trips: 1 },
        { day: 'Thu', cost: 210, trips: 4 },
        { day: 'Fri', cost: 180, trips: 3 },
        { day: 'Sat', cost: 80, trips: 2 },
        { day: 'Sun', cost: 140, trips: 2 }
      ]
    };
  },

  getSafetyAlerts: () => {
    const drivers = api.getDrivers();
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return drivers.map(d => {
      const expiry = new Date(d.licenseExpiryDate);
      if (expiry < today) {
        return { type: 'critical', message: `CRITICAL: Driver ${d.name}'s license expired on ${d.licenseExpiryDate}.`, driverId: d.id };
      } else if (expiry <= thirtyDaysFromNow) {
        const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return { type: 'warning', message: `WARNING: Driver ${d.name}'s license expires in ${daysLeft} days (${d.licenseExpiryDate}).`, driverId: d.id };
      }
      return null;
    }).filter(Boolean);
  },

  exportToCSV: (dataType) => {
    let data = [];
    if (dataType === 'vehicles') data = api.getVehicles();
    else if (dataType === 'drivers') data = api.getDrivers();
    else if (dataType === 'trips') data = api.getTrips();
    else data = api.getExpenses();

    if (data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    );

    return [headers, ...rows].join('\n');
  }
};
