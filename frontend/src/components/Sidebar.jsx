import React from 'react';
import { LayoutDashboard, Truck, Users, Route, Wrench, DollarSign, BarChart3, Settings } from 'lucide-react';

const Sidebar = ({ currentTab, setCurrentTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fleet', label: 'Fleet', icon: Truck },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'trips', label: 'Trips', icon: Route },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'expenses', label: 'Fuel & Expenses', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Bottom Tab Navigation */}
      <nav className="mobile-nav-bar lg:hidden">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon-box">
                <IconComponent size={18} />
              </div>
              <span>{item.label.split(' ')[0]}</span> {/* shorten labels on mobile */}
            </button>
          );
        })}
      </nav>

      {/* Desktop Sidebar Navigation */}
      <aside className="mobile-nav-bar hidden lg:flex">
        <div className="flex items-center gap-3 px-4 py-6 mb-6 border-b border-gray-800 w-full">
          <div className="bg-blue-600 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/30">
            T
          </div>
          <div>
            <h2 className="text-md font-bold leading-none text-white">TransitOps</h2>
            <span className="text-[9px] text-gray-400 font-semibold tracking-wider uppercase">Smart Fleet</span>
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-icon-box">
                  <IconComponent size={18} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="mt-auto w-full pt-4 border-t border-gray-800 px-4">
          <p className="text-[10px] font-medium text-gray-500 text-center">TransitOps Dashboard v1.0</p>
          <p className="text-[8px] text-gray-400 text-center mt-1">Hackathon Light Theme Build</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
