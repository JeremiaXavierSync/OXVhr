import React, { useState } from 'react';

const EmployeeRegistry = () => {
    const [activeTab, setActiveTab] = useState('GENERAL');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'GENERAL':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <div className="form-group"><label>Employee No:</label><input type="text" className="form-control" style={{ width: '150px' }} /></div>
                            <div className="form-group"><label>First Name:</label><input type="text" className="form-control" style={{ width: '250px' }} /></div>
                            <div className="form-group"><label>Middle Name:</label><input type="text" className="form-control" style={{ width: '250px' }} /></div>
                            <div className="form-group"><label>Last Name:</label><input type="text" className="form-control" style={{ width: '250px' }} /></div>
                            <div className="form-group"><label>Display Name:</label><input type="text" className="form-control" style={{ width: '250px' }} /></div>
                            <div className="form-group">
                                <label>Gender:</label>
                                <select className="form-control" style={{ width: '100px' }}>
                                    <option>MALE</option><option>FEMALE</option><option>OTHER</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <div className="form-group"><label>DOB:</label><input type="date" className="form-control" style={{ width: '150px' }} /></div>
                            <div className="form-group"><label>Joining Date:</label><input type="date" className="form-control" style={{ width: '150px' }} /></div>
                            <div className="form-group"><label>Employment Type:</label>
                                <select className="form-control" style={{ width: '150px' }}>
                                    <option>FULL_TIME</option><option>PART_TIME</option><option>CONTRACT</option>
                                </select>
                            </div>
                            <div className="form-group"><label>Department:</label>
                                <select className="form-control" style={{ width: '200px' }}>
                                    <option>OPERATIONS</option><option>ACCOUNTS</option>
                                </select>
                            </div>
                            <div className="form-group"><label>Designation:</label>
                                <select className="form-control" style={{ width: '200px' }}>
                                    <option>DRIVER</option><option>CONDUCTOR</option><option>CLERK</option>
                                </select>
                            </div>
                            <div className="form-group"><label>Status:</label>
                                <select className="form-control" style={{ width: '120px' }}>
                                    <option>ACTIVE</option><option>TRAINING</option><option>ON_LEAVE</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'PERSONAL':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <div className="form-group"><label>Marital Status:</label>
                                <select className="form-control"><option>SINGLE</option><option>MARRIED</option></select>
                            </div>
                            <div className="form-group"><label>Nationality:</label><input type="text" className="form-control" /></div>
                            <div className="form-group"><label>Religion:</label><input type="text" className="form-control" /></div>
                            <div className="form-group"><label>Blood Group:</label><input type="text" className="form-control" style={{ width: '60px' }} /></div>
                        </div>
                        <div>
                            <div className="form-group"><label>National ID Type:</label><input type="text" className="form-control" placeholder="Aadhar/SSN" /></div>
                            <div className="form-group"><label>ID Number:</label><input type="text" className="form-control" /></div>
                            <div className="form-group"><label>Passport No:</label><input type="text" className="form-control" /></div>
                            <div className="form-group"><label>Passport Expiry:</label><input type="date" className="form-control" /></div>
                        </div>
                    </div>
                );
            case 'CONTACT':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <h4 style={{ fontSize: '11px', borderBottom: '1px solid #CCC', marginBottom: '10px' }}>COMMUNICATION</h4>
                            <div className="form-group"><label>Work Email:</label><input type="email" className="form-control" style={{ width: '250px' }} /></div>
                            <div className="form-group"><label>Personal Email:</label><input type="email" className="form-control" style={{ width: '250px' }} /></div>
                            <div className="form-group"><label>Mobile (Pri):</label><input type="text" className="form-control" /></div>
                            <div className="form-group"><label>Mobile (Sec):</label><input type="text" className="form-control" /></div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '11px', borderBottom: '1px solid #CCC', marginBottom: '10px' }}>EMERGENCY CONTACT</h4>
                            <div className="form-group"><label>Contact Name:</label><input type="text" className="form-control" /></div>
                            <div className="form-group"><label>Relationship:</label><input type="text" className="form-control" /></div>
                            <div className="form-group"><label>Phone:</label><input type="text" className="form-control" /></div>
                        </div>
                    </div>
                );
            case 'BANK/STATUTORY':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <h4 style={{ fontSize: '11px', borderBottom: '1px solid #CCC', marginBottom: '10px' }}>BANK DETAILS</h4>
                            <div className="form-group"><label>Bank Name:</label><input type="text" className="form-control" /></div>
                            <div className="form-group"><label>Branch:</label><input type="text" className="form-control" /></div>
                            <div className="form-group"><label>Account No:</label><input type="text" className="form-control" /></div>
                            <div className="form-group"><label>IFSC/Swift:</label><input type="text" className="form-control" /></div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '11px', borderBottom: '1px solid #CCC', marginBottom: '10px' }}>STATUTORY IDS</h4>
                            <div className="form-group"><label>PAN Number:</label><input type="text" className="form-control" /></div>
                            <div className="form-group"><label>PF Number:</label><input type="text" className="form-control" /></div>
                            <div className="form-group"><label>ESI Number:</label><input type="text" className="form-control" /></div>
                        </div>
                    </div>
                );
            case 'ACADEMIC/EXP':
                return (
                    <div>
                         <h4 style={{ fontSize: '11px', borderBottom: '1px solid #CCC', marginBottom: '5px' }}>EDUCATION HISTORY</h4>
                         <table className="data-grid" style={{ marginBottom: '15px' }}>
                            <thead><tr><th>DEGREE</th><th>INSTITUTION</th><th>YEAR</th><th>% / CGPA</th></tr></thead>
                            <tbody>
                                <tr><td><input type="text" className="form-control" style={{border:0}} /></td><td><input type="text" className="form-control" style={{border:0}} /></td><td><input type="text" className="form-control" style={{border:0}} /></td><td><input type="text" className="form-control" style={{border:0}} /></td></tr>
                            </tbody>
                         </table>
                         <h4 style={{ fontSize: '11px', borderBottom: '1px solid #CCC', marginBottom: '5px' }}>PREVIOUS EXPERIENCE</h4>
                         <table className="data-grid">
                            <thead><tr><th>COMPANY</th><th>DESIGNATION</th><th>FROM</th><th>TO</th></tr></thead>
                            <tbody>
                                <tr><td><input type="text" className="form-control" style={{border:0}} /></td><td><input type="text" className="form-control" style={{border:0}} /></td><td><input type="date" className="form-control" style={{border:0}} /></td><td><input type="date" className="form-control" style={{border:0}} /></td></tr>
                            </tbody>
                         </table>
                    </div>
                )
            default: return null;
        }
    };

    return (
        <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRM001 - COMPREHENSIVE EMPLOYEE MASTER
            </h3>

            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '10px' }}>
                {['GENERAL', 'PERSONAL', 'CONTACT', 'BANK/STATUTORY', 'ACADEMIC/EXP'].map(tab => (
                    <div 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '4px 12px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            border: '1px solid var(--border-color)',
                            borderBottom: activeTab === tab ? 'none' : '1px solid var(--border-color)',
                            background: activeTab === tab ? '#FFF' : '#EEE',
                            marginRight: '2px'
                        }}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            
            <div style={{ minHeight: '300px', border: '1px solid #AAA', padding: '15px', background: '#FFF' }}>
                {renderTabContent()}
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid #AAA', paddingTop: '10px' }}>
                <button className="btn-legacy btn-primary">SAVE RECORD (F10)</button>
                <button className="btn-legacy" style={{ marginLeft: '5px' }}>CANCEL (ESC)</button>
                <button className="btn-legacy" style={{ marginLeft: '5px' }}>PRINT PROFILE</button>
            </div>
        </div>
    );
};

export default EmployeeRegistry;
