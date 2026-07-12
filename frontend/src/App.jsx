import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ComingSoon from './components/ComingSoon';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('Fleet Manager');
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);

  // Translate tab IDs to user-friendly titles
  const tabTitles = {
    dashboard: 'Dashboard',
    fleet: 'Fleet Registry',
    drivers: 'Drivers Management',
    trips: 'Trip Dispatches',
    maintenance: 'Maintenance Logs',
    expenses: 'Fuel & Expenses Logs',
    analytics: 'Visual Analytics',
    settings: 'System Settings'
  };

  return (
    <div className="app-container">
      {/* Shell Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
      />
      
      {/* Shell Core Panel */}
      <div className="main-content">
        <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
          {/* Header */}
          <Header 
            currentRole={currentRole} 
            setCurrentRole={setCurrentRole}
            notificationsCount={notificationsCount}
            setNotificationsCount={setNotificationsCount}
            onDispatchClick={() => setDispatchModalOpen(true)}
          />
          
          {/* Active View Container */}
          <main className="flex-1">
            {currentTab === 'dashboard' ? (
              <DashboardView 
                currentRole={currentRole} 
                dispatchModalOpen={dispatchModalOpen}
                setDispatchModalOpen={setDispatchModalOpen}
              />
            ) : (
              <ComingSoon 
                tabName={tabTitles[currentTab]} 
                onGoBack={() => setCurrentTab('dashboard')} 
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
