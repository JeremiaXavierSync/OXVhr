import { useState } from 'react';
import Sidebar from './components/Sidebar';
import EmployeeRegistry from './views/EmployeeRegistry';
import PayrollLedger from './views/PayrollLedger';
import './styles/theme.css';

function App() {
  const [currentView, setCurrentView] = useState('EmployeeRegistry');

  const renderView = () => {
    console.log(`Rendering view: ${currentView}`);
    switch (currentView) {
      case 'EmployeeRegistry': 
        return <EmployeeRegistry />;
      case 'PayrollLedger': 
        return <PayrollLedger />;
      default: 
        return (
          <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
              UNDER CONSTRUCTION
            </h3>
            <div style={{ padding: '20px', background: '#FFFFAA', border: '1px solid #888' }}>
              The module <strong>{currentView}</strong> is currently under development for the KSRTC HR & Payroll system.
              <br /><br />
              Please use <strong>Employee Registry</strong> or <strong>Payroll Ledger</strong> for now.
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <header className="top-header">
        <span>KSRTC ERP SYSTEM - HR & PAYROLL MODULE v1.0.0 (LEGACY TERMINAL)</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px' }}>USER: ADMIN | FY: 2024-25 | LOGGED IN: 10:45 AM</span>
      </header>
      <div className="main-body">
        <Sidebar setView={setCurrentView} currentView={currentView} />
        <main className="workspace">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
