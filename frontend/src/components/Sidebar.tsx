interface SidebarProps {
    setView: (view: string) => void;
    currentView: string;
}

const Sidebar = ({ setView, currentView }: SidebarProps) => {
    const navItems = [
        { section: 'DASHBOARDS', items: [
            { id: 'WorkDesk', label: 'Employee Work Desk' },
            { id: 'Summary', label: 'Summary Status' }
        ]},
        { section: 'MASTERS', items: [
            { id: 'EmployeeRegistry', label: 'Employee Registry' },
            { id: 'SalaryMaster', label: 'Salary Master' },
            { id: 'CostCenters', label: 'Cost Centers' }
        ]},
        { section: 'TASKS', items: [
            { id: 'AttendanceImport', label: 'Attendance Import' },
            { id: 'LeaveProcessing', label: 'Leave Processing' },
            { id: 'PayrollExecution', label: 'Payroll Execution' }
        ]},
        { section: 'REPORTS', items: [
            { id: 'PayrollLedger', label: 'Payroll Ledger' },
            { id: 'AttendanceRegister', label: 'Attendance Register' }
        ]}
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-search">
                <input type="text" placeholder="Search Menu (Alt+S)..." />
            </div>
            
            {navItems.map(section => (
                <div key={section.section} className="nav-section">
                    <div className="nav-header">{section.section}</div>
                    {section.items.map(item => (
                        <div 
                            key={item.id} 
                            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                            onClick={() => {
                                console.log(`Navigating to: ${item.id}`);
                                setView(item.id);
                            }}
                            style={{
                                backgroundColor: currentView === item.id ? '#FFFFAA' : 'transparent',
                                fontWeight: currentView === item.id ? 'bold' : 'normal',
                                borderLeft: currentView === item.id ? '3px solid #003366' : 'none',
                                paddingLeft: currentView === item.id ? '17px' : '20px'
                            }}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
