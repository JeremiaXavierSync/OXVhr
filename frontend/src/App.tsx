import { useState } from 'react';
import Sidebar from './components/Sidebar';
import EmployeeRegistry from './views/EmployeeRegistry';
import PayrollLedger from './views/PayrollLedger';
import SalaryMaster from './views/SalaryMaster';
import CostCenters from './views/CostCenters';
import AttendanceImport from './views/AttendanceImport';
import AttendanceRegister from './views/AttendanceRegister';
import LeaveProcessing from './views/LeaveProcessing';
import PayrollExecution from './views/PayrollExecution';
import './styles/theme.css';

function App() {
  const [currentView, setCurrentView] = useState('EmployeeRegistry');

  const renderView = () => {
    console.log(`Rendering view: ${currentView}`);
    switch (currentView) {
      case 'EmployeeRegistry': return <EmployeeRegistry />;
      case 'PayrollLedger': return <PayrollLedger />;
      case 'SalaryMaster': return <SalaryMaster />;
      case 'CostCenters': return <CostCenters />;
      case 'AttendanceImport': return <AttendanceImport />;
      case 'AttendanceRegister': return <AttendanceRegister />;
      case 'LeaveProcessing': return <LeaveProcessing />;
      case 'PayrollExecution': return <PayrollExecution />;
      
      case 'WorkDesk':
        return (
          <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRP000 - EMPLOYEE WORK DESK (PERSONAL)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#F8F8F8', padding: '15px', border: '1px solid #CCC' }}>
                    <h4>My Recent Payslips</h4>
                    <p style={{ color: '#666', fontSize: '11px' }}>Search Results: 0</p>
                    <button className="btn-legacy" style={{ marginTop: '10px' }} onClick={() => setCurrentView('PayrollLedger')}>View Ledger</button>
                </div>
                <div style={{ background: '#F8F8F8', padding: '15px', border: '1px solid #CCC' }}>
                    <h4>Leave Balance</h4>
                    <p>Annual Leave: 15 Days</p>
                    <p>Sick Leave: 10 Days</p>
                    <button className="btn-legacy" style={{ marginTop: '10px' }} onClick={() => setCurrentView('LeaveProcessing')}>Apply Leave</button>
                </div>
            </div>
          </div>
        );

      case 'Summary':
        return (
          <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRP-DASH - HR SUMMARY STATUS
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                <div style={{ background: '#003366', color: 'white', padding: '15px' }}>
                    <div style={{ fontSize: '10px' }}>TOTAL EMPLOYEES</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>354</div>
                </div>
                <div style={{ background: '#115522', color: 'white', padding: '15px' }}>
                    <div style={{ fontSize: '10px' }}>ACTIVE STAFF</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>342</div>
                </div>
                <div style={{ background: '#AA6600', color: 'white', padding: '15px' }}>
                    <div style={{ fontSize: '10px' }}>PENDING LEAVE</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>12</div>
                </div>
                <div style={{ background: '#880000', color: 'white', padding: '15px' }}>
                    <div style={{ fontSize: '10px' }}>LATE TODAY</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>08</div>
                </div>
            </div>
          </div>
        );

      default: 
        return (
          <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
              MODULE NOT FOUND
            </h3>
            <div style={{ padding: '20px', background: '#FFFFAA', border: '1px solid #888' }}>
              The module <strong>{currentView}</strong> is not correctly registered.
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
