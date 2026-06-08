import React from 'react';

const Sidebar = ({ setView }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-search">
                <input type="text" placeholder="Search Menu (Alt+S)..." />
            </div>
            
            <div className="nav-section">
                <div className="nav-header">DASHBOARDS</div>
                <div className="nav-item">Employee Work Desk</div>
                <div className="nav-item">Summary Status</div>
            </div>

            <div className="nav-section">
                <div className="nav-header">MASTERS</div>
                <div className="nav-item" onClick={() => setView('EmployeeRegistry')}>Employee Registry</div>
                <div className="nav-item">Salary Master</div>
                <div className="nav-item">Cost Centers</div>
            </div>

            <div className="nav-section">
                <div className="nav-header">TASKS</div>
                <div className="nav-item">Attendance Import</div>
                <div className="nav-item">Leave Processing</div>
                <div className="nav-item">Payroll Execution</div>
            </div>

            <div className="nav-section">
                <div className="nav-header">REPORTS</div>
                <div className="nav-item" onClick={() => setView('PayrollLedger')}>Payroll Ledger</div>
                <div className="nav-item">Attendance Register</div>
            </div>
        </div>
    );
};

export default Sidebar;
