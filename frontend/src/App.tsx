import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import EmployeeRegistry from './views/EmployeeRegistry';
import PayrollLedger from './views/PayrollLedger';
import './styles/theme.css';

function App() {
  const [currentView, setCurrentView] = useState('EmployeeRegistry');

  const renderView = () => {
    switch (currentView) {
      case 'EmployeeRegistry': return <EmployeeRegistry />;
      case 'PayrollLedger': return <PayrollLedger />;
      default: return <div className="workspace">Select a module from the sidebar.</div>;
    }
  };

  return (
    <div className="app-container">
      <header className="top-header">
        <span>KSRTC ERP SYSTEM - HR & PAYROLL MODULE v1.0.0 (LEGACY TERMINAL)</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px' }}>USER: ADMIN | FY: 2024-25 | LOGGED IN: 10:45 AM</span>
      </header>
      <div className="main-body">
        <Sidebar setView={setCurrentView} />
        <main className="workspace">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
