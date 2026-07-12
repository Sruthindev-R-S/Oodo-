import React, { useState, useEffect } from 'react';
import { MapPin, Bell, User, ChevronDown, CheckCircle2, Navigation } from 'lucide-react';
import { api } from '../services/api';

const Header = ({ currentRole, setCurrentRole, notificationsCount, setNotificationsCount, onDispatchClick }) => {
  const [roleOpen, setRoleOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const safetyAlerts = api.getSafetyAlerts();
    setAlerts(safetyAlerts);
    setNotificationsCount(safetyAlerts.length);
  }, [setNotificationsCount]);

  return (
    <header className="header-container">
      <div className="header-top">
        {/* Location selector */}
        <div className="location-widget">
          <div className="icon-button">
            <MapPin size={18} />
          </div>
          <div className="location-text">
            <span className="text-gray-500">Operations HQ</span>
            <span className="text-blue-500 font-bold text-xs">Kaba, Kogi State</span>
          </div>
        </div>

        {/* Header Actions (Mockup Search and Profile alignment) */}
        <div className="header-actions">
          {/* Dispatch Shortcut Button from Mockup */}
          <button 
            className="dispatch-shortcut-btn flex items-center gap-1.5"
            onClick={onDispatchClick}
          >
            <Navigation size={14} />
            <span>Dispatch</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              className="icon-button text-gray-400 hover:text-white"
              onClick={() => {
                setAlertsOpen(!alertsOpen);
                setRoleOpen(false);
              }}
            >
              <Bell size={18} />
              {notificationsCount > 0 && (
                <div className="badge">{notificationsCount}</div>
              )}
            </button>
            
            {alertsOpen && (
              <div className="role-options absolute right-0 mt-2 w-80 bg-[#131A2C] shadow-lg rounded-xl border border-gray-800 z-50 overflow-hidden text-white">
                <div className="p-3 bg-[#1C253B] border-b border-gray-800 flex justify-between items-center">
                  <h3 className="font-bold text-xs">Operational Alerts</h3>
                  <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">Safety</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-500 flex flex-col items-center gap-1.5">
                      <CheckCircle2 className="text-green-500" size={20} />
                      All drivers compliant.
                    </div>
                  ) : (
                    alerts.map((alert, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 text-[11px] border-b border-gray-800 flex gap-2 ${
                          alert.type === 'critical' ? 'bg-red-500/5 text-red-400' : 'bg-amber-500/5 text-amber-400'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          alert.type === 'critical' ? 'bg-red-500' : 'bg-amber-500'
                        }`}></div>
                        <p className="leading-tight">{alert.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile dropdown (Mockup Raven K. alignment) */}
          <div className="role-dropdown">
            <button 
              className="role-trigger flex items-center gap-2"
              onClick={() => {
                setRoleOpen(!roleOpen);
                setAlertsOpen(false);
              }}
            >
              {/* Avatar indicator */}
              <div className="bg-blue-600 text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
                RK
              </div>
              <span className="text-white text-xs font-bold">Raven K.</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {roleOpen && (
              <div className="role-options bg-[#131A2C] border border-gray-800">
                <div className="p-2.5 bg-[#1C253B] border-b border-gray-800 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                  Switch Active Role
                </div>
                {[
                  { id: 'Fleet Manager', label: 'Fleet Manager', desc: 'Oversees assets & efficiency' },
                  { id: 'Dispatcher', label: 'Dispatcher', desc: 'Creates and manages trips' },
                  { id: 'Safety Officer', label: 'Safety Officer', desc: 'Monitors driver compliance' },
                  { id: 'Financial Analyst', label: 'Financial Analyst', desc: 'Tracks costs & vehicle ROI' }
                ].map((role) => (
                  <div
                    key={role.id}
                    className={`role-option hover:bg-gray-800 ${currentRole === role.id ? 'bg-blue-900/30 text-blue-400' : 'text-gray-300'}`}
                    onClick={() => {
                      setCurrentRole(role.id);
                      setRoleOpen(false);
                    }}
                  >
                    <span>{role.label}</span>
                    <span>{role.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
