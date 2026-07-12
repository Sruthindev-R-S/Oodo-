import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, Heart, ShieldAlert, 
  MapPin, CheckCircle, Navigation, AlertTriangle, 
  Plus, X, Trash2, Calendar, FileSpreadsheet, ArrowRight,
  TrendingUp, Award, DollarSign, ChevronDown, Wrench, Clock
} from 'lucide-react';
import { api } from '../services/api';

// --- INLINE SVG VEHICLE GRAPHICS ---
const VehicleSVG = ({ type, color = '#007AFF' }) => {
  const isTruck = type.toLowerCase().includes('truck') || type.toLowerCase().includes('harvester') || type.toLowerCase().includes('loader') || type.toLowerCase().includes('crane') || type.toLowerCase().includes('excavator') || type.toLowerCase().includes('bulldozer');
  const isVan = type.toLowerCase().includes('van') || type.toLowerCase().includes('pickup') || type.toLowerCase().includes('commercial') || type.toLowerCase().includes('vehicle') || type.toLowerCase().includes('three-wheeler');
  
  if (isVan) {
    return (
      <svg width="130" height="80" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 45h8v5H5zm77-17l11 12v12H82z" fill="#3A465D" />
        <path d="M5 22h65a4 4 0 014 4v22H5V22z" fill={color} />
        <path d="M70 26h12l8 12v10H70V26z" fill="#1C253B" />
        <path d="M74 29h8v7h-8zm10 7l4 3v-3z" fill="#2E3B52" />
        <circle cx="25" cy="48" r="7" fill="#1A2233" />
        <circle cx="25" cy="48" r="3" fill="#AAB2BD" />
        <circle cx="75" cy="48" r="7" fill="#1A2233" />
        <circle cx="75" cy="48" r="3" fill="#AAB2BD" />
        <rect x="12" y="27" width="22" height="10" rx="1" fill="#FFFFFF" opacity="0.1" />
        <rect x="38" y="27" width="22" height="10" rx="1" fill="#FFFFFF" opacity="0.1" />
      </svg>
    );
  }
  
  if (isTruck) {
    return (
      <svg width="130" height="80" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20h55v26H10z" fill={color} />
        <path d="M67 15h18a2 2 0 012 2v29H67V15z" fill="#2E3B52" />
        <path d="M70 20h12v12H70z" fill="#1A2233" />
        <rect x="5" y="40" width="90" height="8" rx="2" fill="#1A2233" />
        <circle cx="25" cy="48" r="7" fill="#0A0F1D" />
        <circle cx="25" cy="48" r="3" fill="#94A3B8" />
        <circle cx="45" cy="48" r="7" fill="#0A0F1D" />
        <circle cx="45" cy="48" r="3" fill="#94A3B8" />
        <circle cx="78" cy="48" r="7" fill="#0A0F1D" />
        <circle cx="78" cy="48" r="3" fill="#94A3B8" />
      </svg>
    );
  }

  // Default Tractor / Heavy Equipment / Other
  return (
    <svg width="130" height="80" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 32c5-10 15-16 30-16h25c12 0 20 6 25 16H10z" fill={color} />
      <path d="M5 38h90v8H5v-8z" fill="#1E293B" />
      <circle cx="30" cy="46" r="8" fill="#1A2233" />
      <circle cx="30" cy="46" r="3" fill="#FFFFFF" opacity="0.5" />
      <circle cx="70" cy="46" r="8" fill="#1A2233" />
      <circle cx="70" cy="46" r="3" fill="#FFFFFF" opacity="0.5" />
    </svg>
  );
};

const DashboardView = ({ currentRole, dispatchModalOpen, setDispatchModalOpen }) => {
  // --- DATABASE STATE ---
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // --- FILTERS STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRegion, setFilterRegion] = useState('All');
  
  // Specs selected vehicle
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [favorites, setFavorites] = useState(new Set(['Van-05']));

  // Modals
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [maintModalOpen, setMaintModalOpen] = useState(false);
  const [resolveMaintModalOpen, setResolveMaintModalOpen] = useState(false);
  const [newVehicleModalOpen, setNewVehicleModalOpen] = useState(false);

  // Forms
  const [tripCargo, setTripCargo] = useState('');
  const [tripDest, setTripDest] = useState('');
  const [tripSource, setTripSource] = useState('Kaba, Kogi State');
  const [tripDriver, setTripDriver] = useState('');
  const [tripDistance, setTripDistance] = useState('');
  const [tripVehicleOverride, setTripVehicleOverride] = useState(''); // When dispatching from dispatch shortcut
  
  const [completeOdo, setCompleteOdo] = useState('');
  const [completeFuel, setCompleteFuel] = useState('');
  const [completeRevenue, setCompleteRevenue] = useState('');
  const [maintIssue, setMaintIssue] = useState('');
  const [maintCost, setMaintCost] = useState('');
  
  // New Vehicle
  const [newVehId, setNewVehId] = useState('');
  const [newVehName, setNewVehName] = useState('');
  const [newVehType, setNewVehType] = useState('Box Truck');
  const [newVehCap, setNewVehCap] = useState('');
  const [newVehCost, setNewVehCost] = useState('');
  const [newVehRegion, setNewVehRegion] = useState('North');
  const [formError, setFormError] = useState('');

  // --- LOAD DATA ---
  const loadDatabase = () => {
    setVehicles(api.getVehicles());
    setDrivers(api.getDrivers());
    setTrips(api.getTrips());
    setMaintenance(api.getMaintenanceLogs());
    setExpenses(api.getExpenses());
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Set default selection
  useEffect(() => {
    if (selectedVehicle) {
      const updated = vehicles.find(v => v.id === selectedVehicle.id);
      if (updated) setSelectedVehicle(updated);
    } else if (vehicles.length > 0) {
      setSelectedVehicle(vehicles[0]);
    }
  }, [vehicles]);

  // Synchronize trip dispatch selections
  useEffect(() => {
    if (dispatchModalOpen && selectedVehicle) {
      setTripVehicleOverride(selectedVehicle.id);
    }
  }, [dispatchModalOpen, selectedVehicle]);

  // --- FILTER CALCULATIONS ---
  const kpis = api.getDashboardKPIs({
    type: filterType,
    status: filterStatus,
    region: filterRegion
  });

  const analytics = api.getAnalyticsData();
  const safetyAlerts = api.getSafetyAlerts();

  // Filtered Registry list (bottom registry)
  const filteredVehicles = vehicles.filter(veh => {
    const matchesSearch = veh.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          veh.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || veh.type === filterType;
    const matchesRegion = filterRegion === 'All' || veh.region === filterRegion;
    
    let matchesStatus = true;
    if (filterStatus === 'Available') matchesStatus = veh.status === 'Available';
    else if (filterStatus === 'Not Available') matchesStatus = veh.status === 'On Trip' || veh.status === 'Retired';
    else if (filterStatus === 'Maintenance') matchesStatus = veh.status === 'In Shop';

    return matchesSearch && matchesType && matchesRegion && matchesStatus;
  });

  // Dynamic status ratio ratios
  const statusRatios = kpis.statusRatios || { availablePct: 0, ontripPct: 0, inshopPct: 0, retiredPct: 0 };

  const toggleFavorite = (vehId) => {
    const next = new Set(favorites);
    if (next.has(vehId)) next.delete(vehId);
    else next.add(vehId);
    setFavorites(next);
  };

  // --- ACTIONS ---
  const handleCreateVehicle = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (!newVehId || !newVehName || !newVehCap || !newVehCost) {
        throw new Error('All fields are required.');
      }
      
      api.saveVehicle({
        id: newVehId,
        name: newVehName,
        type: newVehType,
        maxCapacity: Number(newVehCap),
        acquisitionCost: Number(newVehCost),
        region: newVehRegion
      });

      loadDatabase();
      setNewVehicleModalOpen(false);
      setNewVehId('');
      setNewVehName('');
      setNewVehCap('');
      setNewVehCost('');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDispatchTrip = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const targetVehicleId = tripVehicleOverride || selectedVehicle?.id;
      if (!targetVehicleId) throw new Error('No vehicle selected.');

      const targetVehicle = vehicles.find(v => v.id === targetVehicleId);
      if (!targetVehicle) throw new Error('Vehicle not found.');

      if (!tripDriver || !tripCargo || !tripDest || !tripDistance) {
        throw new Error('All fields are required.');
      }

      if (Number(tripCargo) > targetVehicle.maxCapacity) {
        throw new Error(`Cargo weight (${tripCargo} kg) exceeds vehicle payload capacity (${targetVehicle.maxCapacity} kg).`);
      }

      const trip = api.createTrip({
        source: tripSource,
        destination: tripDest,
        vehicleId: targetVehicleId,
        driverId: tripDriver,
        cargoWeight: Number(tripCargo),
        distance: Number(tripDistance)
      });

      api.dispatchTrip(trip.id);

      loadDatabase();
      setDispatchModalOpen(false);
      setTripCargo('');
      setTripDest('');
      setTripDriver('');
      setTripDistance('');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleCompleteTrip = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (!completeOdo || !completeFuel || !completeRevenue) {
        throw new Error('All completion fields are required.');
      }

      const activeTrip = trips.find(t => t.vehicleId === selectedVehicle.id && t.status === 'Dispatched');
      if (!activeTrip) throw new Error('No active trip found for this vehicle.');

      api.completeTrip(activeTrip.id, completeOdo, completeFuel, completeRevenue);

      loadDatabase();
      setCompleteModalOpen(false);
      setCompleteOdo('');
      setCompleteFuel('');
      setCompleteRevenue('');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleStartMaintenance = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (!maintIssue) throw new Error('Maintenance issue details are required.');

      api.createMaintenance(selectedVehicle.id, maintIssue);
      
      loadDatabase();
      setMaintModalOpen(false);
      setMaintIssue('');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleResolveMaintenance = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (!maintCost) throw new Error('Maintenance cost is required.');

      const activeMaint = maintenance.find(m => m.vehicleId === selectedVehicle.id && m.status === 'In Shop');
      if (!activeMaint) throw new Error('No active maintenance record found.');

      api.closeMaintenance(activeMaint.id, maintCost);

      loadDatabase();
      setResolveMaintModalOpen(false);
      setMaintCost('');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleCSVExport = (type) => {
    const csvContent = api.exportToCSV(type);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transitops_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // UI Selection Contexts
  const currentTrip = trips.find(t => t.vehicleId === selectedVehicle?.id && t.status === 'Dispatched');
  const activeDriver = currentTrip ? drivers.find(d => d.id === currentTrip.driverId) : null;
  const activeMaintenanceLog = maintenance.find(m => m.vehicleId === selectedVehicle?.id && m.status === 'In Shop');

  return (
    <div className={`dashboard-grid ${selectedVehicle ? 'has-selection' : 'no-selection'}`}>
      
      {/* --- LEFT / CENTER SECTION --- */}
      <div className="flex flex-col">
        
        {/* Search header (mockup style) */}
        <div className="search-container mb-4">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="filter-button" onClick={() => { setFilterType('All'); setFilterStatus('All'); setFilterRegion('All'); }}>
              <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>

        {/* 3-Dropdown Filters Row (mockup style) */}
        <div className="filters-bar">
          <span className="filters-label">Filters</span>
          <div className="filters-group">
            {/* Vehicle Type Dropdown with Sub-Groups */}
            <div className="filter-select-wrapper">
              <select 
                className="filter-dropdown-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">Vehicle Type: All</option>
                
                <optgroup label="🚚 Trucks">
                  <option value="Box Truck">Box Truck</option>
                  <option value="Flatbed Truck">Flatbed Truck</option>
                  <option value="Refrigerated Truck (Reefer)">Refrigerated Truck (Reefer)</option>
                  <option value="Tanker Truck">Tanker Truck</option>
                  <option value="Dump Truck">Dump Truck</option>
                </optgroup>
                
                <optgroup label=" Vans">
                  <option value="Cargo Van">Cargo Van</option>
                  <option value="Passenger Van">Passenger Van</option>
                  <option value="Mini Van">Mini Van</option>
                  <option value="Utility Van">Utility Van</option>
                  <option value="Refrigerated Van">Refrigerated Van</option>
                </optgroup>
                
                <optgroup label=" Light Commercial">
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Pickup Truck">Pickup Truck</option>
                  <option value="Light Duty Truck">Light Duty Truck</option>
                  <option value="Cargo Three-Wheeler">Cargo Three-Wheeler</option>
                  <option value="Delivery Vehicle">Delivery Vehicle</option>
                </optgroup>
                
                <optgroup label=" Construction & Heavy">
                  <option value="Excavator">Excavator</option>
                  <option value="Bulldozer">Bulldozer</option>
                  <option value="Wheel Loader">Wheel Loader</option>
                  <option value="Forklift">Forklift</option>
                  <option value="Crane">Crane</option>
                </optgroup>
                
                <optgroup label="🚜 Agricultural">
                  <option value="Tractor">Tractor</option>
                  <option value="Combine Harvester">Combine Harvester</option>
                  <option value="Sprayer Vehicle">Sprayer Vehicle</option>
                  <option value="Seeder">Seeder</option>
                  <option value="Cultivator">Cultivator</option>
                </optgroup>
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="filter-select-wrapper">
              <select 
                className="filter-dropdown-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">Status: All</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available (Busy)</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            {/* Region Dropdown */}
            <div className="filter-select-wrapper">
              <select 
                className="filter-dropdown-select"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
              >
                <option value="All">Region: All</option>
                <option value="North">North Region</option>
                <option value="East">East Region</option>
                <option value="South">South Region</option>
                <option value="West">West Region</option>
              </select>
            </div>
          </div>
        </div>

        {/* 7 KPI Cards Row (mockup style) */}
        <div className="kpi-row">
          <div className="kpi-card green-border">
            <span className="kpi-label">Active Vehicles</span>
            <span className="kpi-val">{kpis.activeVehicles}</span>
          </div>
          <div className="kpi-card green-border">
            <span className="kpi-label">Available Vehicles</span>
            <span className="kpi-val">{kpis.availableVehicles}</span>
          </div>
          <div className="kpi-card orange-border">
            <span className="kpi-label">Vehicles in Maint.</span>
            <span className="kpi-val">{String(kpis.inShopVehicles).padStart(2, '0')}</span>
          </div>
          <div className="kpi-card blue-border">
            <span className="kpi-label">Active Trips</span>
            <span className="kpi-val">{kpis.activeTrips}</span>
          </div>
          <div className="kpi-card blue-border">
            <span className="kpi-label">Pending Trips</span>
            <span className="kpi-val">{String(kpis.pendingTrips).padStart(2, '0')}</span>
          </div>
          <div className="kpi-card blue-border">
            <span className="kpi-label">Drivers On Duty</span>
            <span className="kpi-val">{kpis.driversOnDuty}</span>
          </div>
          <div className="kpi-card green-border">
            <span className="kpi-label">Fleet Utilization</span>
            <span className="kpi-val">{kpis.fleetUtilization}%</span>
          </div>
        </div>

        {/* Dual column section (Trips table & Progress Ratios) */}
        <div className="dashboard-columns">
          
          {/* Recent Trips Card */}
          <div className="section-card">
            <h3 className="section-card-title flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              Recent Trips
            </h3>
            
            <div className="table-wrapper">
              <table className="trips-table">
                <thead>
                  <tr>
                    <th>Trip</th>
                    <th>Vehicle</th>
                    <th>Driver</th>
                    <th>Status</th>
                    <th>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => {
                    const matchedDriver = drivers.find(d => d.id === trip.driverId);
                    
                    let statusClass = 'draft';
                    if (trip.status === 'Dispatched') statusClass = 'dispatched';
                    else if (trip.status === 'On Trip') statusClass = 'ontrip';
                    else if (trip.status === 'Completed') statusClass = 'completed';
                    else if (trip.status === 'Cancelled') statusClass = 'cancelled';

                    return (
                      <tr 
                        key={trip.id} 
                        className="cursor-pointer" 
                        onClick={() => {
                          const veh = vehicles.find(v => v.id === trip.vehicleId);
                          if (veh) setSelectedVehicle(veh);
                        }}
                      >
                        <td className="font-bold text-blue-500">{trip.id}</td>
                        <td className="font-semibold">{trip.vehicleId || '—'}</td>
                        <td>{matchedDriver ? matchedDriver.name.split(' ')[0] : '—'}</td>
                        <td>
                          <span className={`status-pill ${statusClass}`}>{trip.status}</span>
                        </td>
                        <td className="text-gray-400 font-medium">{trip.eta || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vehicle Status Progress Ratio Card */}
          <div className="section-card">
            <h3 className="section-card-title flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-emerald-500" />
              Vehicle Status Ratio
            </h3>
            
            <div className="progress-list">
              <div className="progress-item">
                <div className="progress-label-bar">
                  <span>Available</span>
                  <span>{statusRatios.availablePct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill available" style={{ width: `${statusRatios.availablePct}%` }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label-bar">
                  <span>On Trip (Not Available)</span>
                  <span>{statusRatios.ontripPct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill ontrip" style={{ width: `${statusRatios.ontripPct}%` }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label-bar">
                  <span>In Shop (Maintenance)</span>
                  <span>{statusRatios.inshopPct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill inshop" style={{ width: `${statusRatios.inshopPct}%` }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label-bar">
                  <span>Retired</span>
                  <span>{statusRatios.retiredPct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill retired" style={{ width: `${statusRatios.retiredPct}%` }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Lower Assets Registry Section */}
        <div className="vehicles-section">
          <div className="section-header">
            <span className="section-title">Fleet Assets Registry ({filteredVehicles.length})</span>
            <button className="view-all-link" onClick={() => setNewVehicleModalOpen(true)}>
              + Add Fleet Asset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVehicles.map((veh) => {
              const isSelected = selectedVehicle?.id === veh.id;
              const isFav = favorites.has(veh.id);
              
              let statusStyle = {};
              if (veh.status === 'Available') statusStyle = { backgroundColor: 'var(--status-available-bg)', color: 'var(--status-available)' };
              else if (veh.status === 'On Trip') statusStyle = { backgroundColor: 'var(--status-ontrip-bg)', color: 'var(--status-ontrip)' };
              else if (veh.status === 'In Shop') statusStyle = { backgroundColor: 'var(--status-inshop-bg)', color: 'var(--status-inshop)' };
              else statusStyle = { backgroundColor: 'var(--status-retired-bg)', color: 'var(--status-retired)' };

              return (
                <div 
                  key={veh.id}
                  className={`vehicle-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedVehicle(veh)}
                >
                  <div className="card-rating-badge">
                    <span>★</span>
                    <span>{veh.rating.toFixed(1)}</span>
                  </div>

                  <button 
                    className="card-favorite-badge"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(veh.id);
                    }}
                  >
                    <Heart size={14} fill={isFav ? 'var(--primary)' : 'none'} />
                  </button>

                  <div className="card-image-container">
                    <VehicleSVG type={veh.type} color={isSelected ? '#007AFF' : '#2F3C56'} />
                  </div>

                  <div className="card-status-pill" style={statusStyle}>
                    {veh.status}
                  </div>

                  <div className="card-info">
                    <div className="card-title-group">
                      <span className="card-title">{veh.name}</span>
                      <span className="card-subtitle">{veh.id} • {veh.type}</span>
                    </div>
                    <div className="card-price-group">
                      <span className="card-price">${veh.price}</span>
                      <span className="card-price-label">/ hour</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CSV exports panel */}
        <div className="px-5 mb-8">
          <div className="section-card">
            <h3 className="section-card-title flex items-center gap-2">
              <FileSpreadsheet className="text-blue-500" size={16} />
              Operational Data CSV Exports
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button onClick={() => handleCSVExport('vehicles')} className="role-trigger justify-center text-xs py-2">Fleet Registry</button>
              <button onClick={() => handleCSVExport('drivers')} className="role-trigger justify-center text-xs py-2">Duty Drivers</button>
              <button onClick={() => handleCSVExport('trips')} className="role-trigger justify-center text-xs py-2">Trip Logs</button>
              <button onClick={() => handleCSVExport('expenses')} className="role-trigger justify-center text-xs py-2">Expense Ledger</button>
            </div>
          </div>
        </div>

      </div>

      {/* --- RIGHT PANEL: ASSET SPEC DETAILS --- */}
      <div className="detail-panel">
        {selectedVehicle ? (
          <>
            <div className="detail-header">
              <div className="detail-back" onClick={() => setFilterStatus('All')}>
                <ChevronDown size={16} className="transform rotate-90" />
              </div>
              <h2 className="detail-title">Asset Specs</h2>
              <div 
                className={`detail-fav ${favorites.has(selectedVehicle.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(selectedVehicle.id)}
              >
                <Heart size={16} fill={favorites.has(selectedVehicle.id) ? '#FF3B30' : 'none'} />
              </div>
            </div>

            {/* Illustration Visualizer with curved dot line */}
            <div className="detail-hero">
              <VehicleSVG type={selectedVehicle.type} color="#007AFF" />
              <div className="detail-curve">
                <div className="detail-curve-dot"></div>
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-lg font-black text-white">{selectedVehicle.name}</h1>
              <p className="text-xs text-gray-400 mt-1">{selectedVehicle.type} • Reg ID: {selectedVehicle.id} • Region: {selectedVehicle.region}</p>
            </div>

            {/* Spec Cards grid */}
            <div className="specs-grid">
              <div className="spec-card">
                <div className="spec-icon-wrapper">
                  <Award size={14} />
                </div>
                <span className="spec-value">{selectedVehicle.enginePower}</span>
                <span className="spec-label">Engine</span>
              </div>
              <div className="spec-card">
                <div className="spec-icon-wrapper">
                  <Navigation size={14} />
                </div>
                <span className="spec-value">{selectedVehicle.maxSpeed}</span>
                <span className="spec-label">Max Speed</span>
              </div>
              <div className="spec-card">
                <div className="spec-icon-wrapper">
                  <DollarSign size={14} />
                </div>
                <span className="spec-value">{selectedVehicle.fuelType}</span>
                <span className="spec-label">Fuel</span>
              </div>
            </div>

            {/* Technical details block */}
            <div className="bg-[#1C253B] p-4 rounded-xl border border-gray-800 mb-6 text-white">
              <div className="flex justify-between py-2 border-b border-gray-800 text-xs">
                <span className="text-gray-400">Odometer</span>
                <span className="font-bold">{selectedVehicle.odometer} km</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800 text-xs">
                <span className="text-gray-400">Payload Capacity</span>
                <span className="font-bold">{selectedVehicle.maxCapacity} kg</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800 text-xs">
                <span className="text-gray-400">Acquisition Value</span>
                <span className="font-bold">${selectedVehicle.acquisitionCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-xs">
                <span className="text-gray-400">Calculated ROI</span>
                <span className="font-bold text-blue-400">
                  {(() => {
                    const vehTrips = trips.filter(t => t.vehicleId === selectedVehicle.id && t.status === 'Completed');
                    const revenue = vehTrips.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
                    const vehExpenses = expenses.filter(e => e.vehicleId === selectedVehicle.id);
                    const expense = vehExpenses.reduce((acc, curr) => acc + curr.amount, 0);
                    const roi = ((revenue - expense) / selectedVehicle.acquisitionCost) * 100;
                    return roi > 0 ? `+${roi.toFixed(1)}%` : `${roi.toFixed(1)}%`;
                  })()}
                </span>
              </div>
            </div>

            {/* Route Map tracker */}
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Active Trip Route Progress</h3>
            <div className="route-visualizer">
              <div className="route-line"></div>
              
              <div className="route-step">
                <div className="route-dot"></div>
                <div className="route-info">
                  <span className="route-label">Departure Source</span>
                  <span className="route-val text-xs">{currentTrip ? currentTrip.source : 'Operations Depot'}</span>
                </div>
              </div>

              <div className="route-step">
                <div className="route-dot destination"></div>
                <div className="route-info">
                  <span className="route-label">Destination Arrival</span>
                  <span className="route-val text-xs">{currentTrip ? currentTrip.destination : 'Idle / Unassigned'}</span>
                </div>
              </div>
            </div>

            {/* Driver Profile */}
            {activeDriver && (
              <div className="bg-blue-950/20 border border-blue-900/40 p-4 rounded-xl mb-6">
                <h4 className="font-bold text-[10px] text-blue-400 uppercase tracking-wider mb-2">Assigned Operator</h4>
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white text-sm">{activeDriver.name}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{activeDriver.licenseCategory} • Exp: {activeDriver.licenseExpiryDate}</p>
                  </div>
                  <div className="bg-[#1C253B] border border-blue-900/50 px-2.5 py-1.5 rounded text-center">
                    <span className="text-[8px] text-gray-400 uppercase block font-bold">Safety Score</span>
                    <span className="font-black text-blue-400">★ {activeDriver.safetyScore.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance shop view */}
            {selectedVehicle.status === 'In Shop' && activeMaintenanceLog && (
              <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-xl mb-6">
                <h4 className="font-bold text-[10px] text-amber-400 uppercase tracking-wider mb-2">Shop Maintenance Details</h4>
                <div className="flex gap-2 text-xs text-amber-200">
                  <AlertTriangle className="text-amber-500 shrink-0" size={16} />
                  <div>
                    <span className="font-bold">Issue logged:</span>
                    <p className="mt-0.5">{activeMaintenanceLog.issue}</p>
                    <span className="block text-[9px] text-gray-500 mt-1">Date entry: {activeMaintenanceLog.date}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Detail price bottom bar layout */}
            <div className="detail-bottom-bar">
              <div className="detail-price-box">
                <span className="detail-price-lbl">Acquisition Cost</span>
                <span className="detail-price-val">${selectedVehicle.acquisitionCost.toLocaleString()}</span>
              </div>

              {selectedVehicle.status === 'Available' && (
                <button className="book-btn" onClick={() => setDispatchModalOpen(true)}>
                  Dispatch Trip
                </button>
              )}

              {selectedVehicle.status === 'On Trip' && (
                <button className="book-btn" style={{ backgroundColor: 'var(--status-available)' }} onClick={() => setCompleteModalOpen(true)}>
                  Complete Trip
                </button>
              )}

              {selectedVehicle.status === 'In Shop' && (
                <button className="book-btn" style={{ backgroundColor: 'var(--status-inshop)' }} onClick={() => setResolveMaintModalOpen(true)}>
                  Resolve Maintenance
                </button>
              )}

              {selectedVehicle.status === 'Retired' && (
                <button className="book-btn" disabled>
                  Asset Retired
                </button>
              )}
            </div>

            {/* Maintenance entry shortcut */}
            {selectedVehicle.status === 'Available' && (
              <button 
                onClick={() => setMaintModalOpen(true)}
                className="w-full mt-3 py-2 border border-dashed border-amber-500/50 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 rounded-xl text-xs font-bold transition"
              >
                Log Maintenance entry
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <TrendingUp size={48} className="mb-4" />
            <p className="text-sm">Select an asset from the list to load specifications details.</p>
          </div>
        )}
      </div>

      {/* --- DISPATCH TRIP MODAL --- */}
      {dispatchModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="font-bold text-lg">Create Dispatch Trip</h2>
              <button className="modal-close" onClick={() => setDispatchModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleDispatchTrip}>
              <div className="form-group">
                <label className="form-label">Asset to Dispatch</label>
                <select 
                  className="form-select"
                  value={tripVehicleOverride}
                  onChange={(e) => setTripVehicleOverride(e.target.value)}
                  required
                >
                  <option value="">-- Select Available Asset --</option>
                  {vehicles
                    .filter(v => v.status === 'Available')
                    .map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.id}) - Max Load: {v.maxCapacity}kg
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assign Duty Driver</label>
                <select 
                  className="form-select"
                  value={tripDriver}
                  onChange={(e) => setTripDriver(e.target.value)}
                  required
                >
                  <option value="">-- Choose Operator --</option>
                  {drivers
                    .filter(d => {
                      const isAva = d.status === 'Available';
                      const isExpired = new Date(d.licenseExpiryDate) < new Date();
                      return isAva && !isExpired;
                    })
                    .map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} (Safety Score: {d.safetyScore.toFixed(1)})
                      </option>
                    ))
                  }
                </select>
                {drivers.filter(d => d.status === 'Available').length === 0 && (
                  <p className="form-warning">No available drivers on duty.</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Cargo Weight (kg)</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g. 450"
                  value={tripCargo}
                  onChange={(e) => setTripCargo(e.target.value)}
                  required
                />
                {tripCargo && tripVehicleOverride && (() => {
                  const targetVeh = vehicles.find(v => v.id === tripVehicleOverride);
                  if (targetVeh && Number(tripCargo) > targetVeh.maxCapacity) {
                    return <p className="form-warning">Warning: Exceeds vehicle payload limit ({targetVeh.maxCapacity} kg).</p>;
                  }
                  return null;
                })()}
              </div>

              <div className="form-group">
                <label className="form-label">Route Destination</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. Lokoja Distribution Warehouse"
                  value={tripDest}
                  onChange={(e) => setTripDest(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Planned Distance (km)</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g. 85"
                  value={tripDistance}
                  onChange={(e) => setTripDistance(e.target.value)}
                  required
                />
              </div>

              {formError && <div className="text-red-500 text-xs mb-3 font-semibold">{formError}</div>}

              <button 
                type="submit" 
                className="form-submit-btn"
                disabled={(() => {
                  const targetVeh = vehicles.find(v => v.id === tripVehicleOverride);
                  return targetVeh && Number(tripCargo) > targetVeh.maxCapacity;
                })()}
              >
                Confirm Dispatch
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- COMPLETE TRIP MODAL --- */}
      {completeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="font-bold text-lg">Log Trip Complete</h2>
              <button className="modal-close" onClick={() => setCompleteModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCompleteTrip}>
              <div className="form-group">
                <span className="form-label">Starting Odometer</span>
                <span className="text-sm font-bold block p-2 bg-[#1C253B] rounded">{selectedVehicle?.odometer} km</span>
              </div>

              <div className="form-group">
                <label className="form-label">Final Odometer Reading (km)</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder={`Must be >= ${selectedVehicle?.odometer}`}
                  value={completeOdo}
                  onChange={(e) => setCompleteOdo(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fuel Consumed (Liters)</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g. 18"
                  value={completeFuel}
                  onChange={(e) => setCompleteFuel(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Revenue Generated ($)</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g. 500"
                  value={completeRevenue}
                  onChange={(e) => setCompleteRevenue(e.target.value)}
                  required
                />
              </div>

              {formError && <div className="text-red-500 text-xs mb-3 font-semibold">{formError}</div>}

              <button type="submit" className="form-submit-btn">
                Complete and Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- START MAINTENANCE MODAL --- */}
      {maintModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="font-bold text-lg">Send Asset to maintenance shop</h2>
              <button className="modal-close" onClick={() => setMaintModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleStartMaintenance}>
              <div className="form-group">
                <label className="form-label">Log Issue Description</label>
                <textarea 
                  className="form-input h-24"
                  placeholder="e.g. Standard engine tuneup, brake replacement, or diagnostic code checks"
                  value={maintIssue}
                  onChange={(e) => setMaintIssue(e.target.value)}
                  required
                />
              </div>

              {formError && <div className="text-red-500 text-xs mb-3 font-semibold">{formError}</div>}

              <button type="submit" className="form-submit-btn">
                Log entry to Shop
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- RESOLVE MAINTENANCE MODAL --- */}
      {resolveMaintModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="font-bold text-lg">Resolve Maintenance</h2>
              <button className="modal-close" onClick={() => setResolveMaintModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleResolveMaintenance}>
              <div className="form-group">
                <label className="form-label">Reported Shop Issue</label>
                <p className="text-xs bg-[#1C253B] border border-gray-800 p-3 rounded text-gray-300">{activeMaintenanceLog?.issue}</p>
              </div>

              <div className="form-group">
                <label className="form-label">Repair Costs ($)</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g. 180"
                  value={maintCost}
                  onChange={(e) => setMaintCost(e.target.value)}
                  required
                />
              </div>

              {formError && <div className="text-red-500 text-xs mb-3 font-semibold">{formError}</div>}

              <button type="submit" className="form-submit-btn">
                Close Maintenance Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- REGISTER ASSET MODAL --- */}
      {newVehicleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="font-bold text-lg text-white">Register Fleet Asset</h2>
              <button className="modal-close" onClick={() => setNewVehicleModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateVehicle}>
              <div className="form-group">
                <label className="form-label">Registration ID (Unique)</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. Van-05"
                  value={newVehId}
                  onChange={(e) => setNewVehId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Asset Name / Model</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. Volvo FH flatbed"
                  value={newVehName}
                  onChange={(e) => setNewVehName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Asset Category</label>
                <select 
                  className="form-select"
                  value={newVehType}
                  onChange={(e) => setNewVehType(e.target.value)}
                >
                  <optgroup label="🚚 Trucks">
                    <option value="Box Truck">Box Truck</option>
                    <option value="Flatbed Truck">Flatbed Truck</option>
                    <option value="Refrigerated Truck (Reefer)">Refrigerated Truck (Reefer)</option>
                    <option value="Tanker Truck">Tanker Truck</option>
                    <option value="Dump Truck">Dump Truck</option>
                  </optgroup>
                  <optgroup label=" Vans">
                    <option value="Cargo Van">Cargo Van</option>
                    <option value="Passenger Van">Passenger Van</option>
                    <option value="Mini Van">Mini Van</option>
                    <option value="Utility Van">Utility Van</option>
                    <option value="Refrigerated Van">Refrigerated Van</option>
                  </optgroup>
                  <optgroup label=" Light Commercial">
                    <option value="Mini Truck">Mini Truck</option>
                    <option value="Pickup Truck">Pickup Truck</option>
                    <option value="Light Duty Truck">Light Duty Truck</option>
                    <option value="Cargo Three-Wheeler">Cargo Three-Wheeler</option>
                    <option value="Delivery Vehicle">Delivery Vehicle</option>
                  </optgroup>
                  <optgroup label=" Construction & Heavy">
                    <option value="Excavator">Excavator</option>
                    <option value="Bulldozer">Bulldozer</option>
                    <option value="Wheel Loader">Wheel Loader</option>
                    <option value="Forklift">Forklift</option>
                    <option value="Crane">Crane</option>
                  </optgroup>
                  <optgroup label="🚜 Agricultural">
                    <option value="Tractor">Tractor</option>
                    <option value="Combine Harvester">Combine Harvester</option>
                    <option value="Sprayer Vehicle">Sprayer Vehicle</option>
                    <option value="Seeder">Seeder</option>
                    <option value="Cultivator">Cultivator</option>
                  </optgroup>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payload Capacity (kg)</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g. 500"
                  value={newVehCap}
                  onChange={(e) => setNewVehCap(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Acquisition Cost ($)</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g. 45000"
                  value={newVehCost}
                  onChange={(e) => setNewVehCost(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deployment Region</label>
                <select 
                  className="form-select"
                  value={newVehRegion}
                  onChange={(e) => setNewVehRegion(e.target.value)}
                >
                  <option value="North">North Region</option>
                  <option value="East">East Region</option>
                  <option value="South">South Region</option>
                  <option value="West">West Region</option>
                </select>
              </div>

              {formError && <div className="text-red-500 text-xs mb-3 font-semibold">{formError}</div>}

              <button type="submit" className="form-submit-btn">
                Register Asset
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardView;
