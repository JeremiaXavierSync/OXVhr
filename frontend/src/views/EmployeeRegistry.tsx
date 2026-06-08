import React, { useState, useEffect } from 'react';
import { mastersApi } from '../services/api';

const EmployeeRegistry = () => {
    const [activeTab, setActiveTab] = useState('LIST');
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        employee_number: '',
        first_name: '',
        last_name: '',
        gender: 'MALE',
        dob: '',
        joining_date: '',
        dept_id: '',
        designation_id: '',
        category_id: ''
    });

    // Masters Data
    const [masters, setMasters] = useState({
        departments: [],
        designations: [],
        categories: []
    });

    useEffect(() => {
        fetchEmployees();
        fetchMasters();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await mastersApi.getEmployees();
            setEmployees(res.data);
        } catch (err) {
            console.error('Failed to fetch employees', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMasters = async () => {
        try {
            const [depts, desigs, cats] = await Promise.all([
                mastersApi.getDepartments(),
                mastersApi.getDesignations(),
                mastersApi.getCategories()
            ]);
            setMasters({
                departments: depts.data,
                designations: desigs.data,
                categories: cats.data
            });
        } catch (err) {
            console.error('Failed to fetch masters', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await mastersApi.createEmployee(formData);
            alert('Employee created successfully!');
            setActiveTab('LIST');
            fetchEmployees();
        } catch (err) {
            alert('Error creating employee: ' + err.message);
        }
    };

    const renderList = () => (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <button className="btn-legacy" onClick={() => setActiveTab('CREATE')}>+ ADD NEW EMPLOYEE</button>
            </div>
            <table className="data-grid">
                <thead>
                    <tr>
                        <th>EMP NO</th>
                        <th>NAME</th>
                        <th>DEPARTMENT</th>
                        <th>DESIGNATION</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.emp_id}>
                            <td>{emp.employee_number}</td>
                            <td>{`${emp.first_name} ${emp.last_name}`}</td>
                            <td>{emp.dept_name}</td>
                            <td>{emp.designation_name}</td>
                            <td>{emp.status}</td>
                        </tr>
                    ))}
                    {employees.length === 0 && !loading && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No employees found.</td></tr>}
                </tbody>
            </table>
        </div>
    );

    const renderForm = () => (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <div className="form-group">
                        <label>Employee No:</label>
                        <input name="employee_number" type="text" className="form-control" onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>First Name:</label>
                        <input name="first_name" type="text" className="form-control" onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input name="last_name" type="text" className="form-control" onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Gender:</label>
                        <select name="gender" className="form-control" onChange={handleInputChange}>
                            <option value="MALE">MALE</option>
                            <option value="FEMALE">FEMALE</option>
                            <option value="OTHER">OTHER</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div className="form-group"><label>DOB:</label><input name="dob" type="date" className="form-control" onChange={handleInputChange} required /></div>
                    <div className="form-group"><label>Joining Date:</label><input name="joining_date" type="date" className="form-control" onChange={handleInputChange} required /></div>
                    <div className="form-group">
                        <label>Department:</label>
                        <select name="dept_id" className="form-control" onChange={handleInputChange} required>
                            <option value="">Select Department</option>
                            {masters.departments.map(d => <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Designation:</label>
                        <select name="designation_id" className="form-control" onChange={handleInputChange} required>
                            <option value="">Select Designation</option>
                            {masters.designations.map(d => <option key={d.designation_id} value={d.designation_id}>{d.designation_name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Category:</label>
                        <select name="category_id" className="form-control" onChange={handleInputChange} required>
                            <option value="">Select Category</option>
                            {masters.categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-legacy">SAVE EMPLOYEE</button>
                <button type="button" className="btn-legacy" onClick={() => setActiveTab('LIST')}>CANCEL</button>
            </div>
        </form>
    );

    return (
        <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRP001 - EMPLOYEE MASTER REGISTRY
            </h3>
            {activeTab === 'LIST' ? renderList() : renderForm()}
        </div>
    );
};

export default EmployeeRegistry;
