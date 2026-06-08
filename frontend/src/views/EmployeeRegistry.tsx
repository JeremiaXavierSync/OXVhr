import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { mastersApi } from '../services/api';

interface Employee {
    emp_id: number;
    employee_number: string;
    first_name: string;
    last_name: string;
    dept_name: string;
    designation_name: string;
    status: string;
}

interface Department {
    dept_id: number;
    dept_name: string;
}

interface Designation {
    designation_id: number;
    designation_name: string;
}

interface Category {
    category_id: number;
    category_name: string;
}

const EmployeeRegistry = () => {
    const [activeTab, setActiveTab] = useState('LIST');
    const [formTab, setFormTab] = useState('OFFICIAL'); // OFFICIAL, PERSONAL, BANK, STATUTORY, EDUCATION, EXPERIENCE
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Comprehensive Enterprise Form State
    const [formData, setFormData] = useState({
        // Official
        employee_number: '', first_name: '', middle_name: '', last_name: '', 
        gender: 'MALE', dob: '', joining_date: '', 
        dept_id: '', designation_id: '', category_id: '',
        employment_type: 'FULL_TIME', work_email: '', mobile_primary: '',
        
        // Personal
        marital_status: 'SINGLE', religion: '', blood_group: '', national_id_number: '',
        
        // Bank
        bank_name: '', branch_name: '', account_number: '', ifsc_code: '', account_holder_name: '',
        
        // Statutory
        pf_number: '', esi_number: '', pan_number: '',
        
        // Emergency
        emergency_name: '', emergency_relationship: '', emergency_phone: '',

        // Education
        degree_name: '', institution: '', specialization: '', year_of_passing: '', percentage_cgpa: '',

        // Experience
        company_name: '', previous_designation: '', exp_from_date: '', exp_to_date: '', reason_for_leaving: ''
    });

    const [masters, setMasters] = useState<{
        departments: Department[];
        designations: Designation[];
        categories: Category[];
    }>({
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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await mastersApi.createEmployee(formData);
            alert('Enterprise Employee Record created successfully!');
            setActiveTab('LIST');
            fetchEmployees();
        } catch (err: any) {
            alert('Error creating employee: ' + (err.message || 'Unknown error'));
        }
    };

    const renderList = () => (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <button className="btn-legacy" onClick={() => { setActiveTab('CREATE'); setFormTab('OFFICIAL'); }}>+ ADD NEW EMPLOYEE</button>
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
                            <td>{emp.dept_name || '-'}</td>
                            <td>{emp.designation_name || '-'}</td>
                            <td>{emp.status}</td>
                        </tr>
                    ))}
                    {employees.length === 0 && !loading && <tr><td colSpan={5} style={{ textAlign: 'center' }}>No employees found.</td></tr>}
                </tbody>
            </table>
        </div>
    );

    const renderFormContent = () => {
        switch(formTab) {
            case 'OFFICIAL':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <div className="form-group"><label>Employee No *:</label><input name="employee_number" type="text" className="form-control" onChange={handleInputChange} value={formData.employee_number} required /></div>
                            <div className="form-group"><label>First Name *:</label><input name="first_name" type="text" className="form-control" onChange={handleInputChange} value={formData.first_name} required /></div>
                            <div className="form-group"><label>Middle Name:</label><input name="middle_name" type="text" className="form-control" onChange={handleInputChange} value={formData.middle_name} /></div>
                            <div className="form-group"><label>Last Name *:</label><input name="last_name" type="text" className="form-control" onChange={handleInputChange} value={formData.last_name} required /></div>
                            <div className="form-group">
                                <label>Gender:</label>
                                <select name="gender" className="form-control" onChange={handleInputChange} value={formData.gender}>
                                    <option value="MALE">MALE</option><option value="FEMALE">FEMALE</option><option value="OTHER">OTHER</option>
                                </select>
                            </div>
                            <div className="form-group"><label>DOB *:</label><input name="dob" type="date" className="form-control" onChange={handleInputChange} value={formData.dob} required /></div>
                        </div>
                        <div>
                            <div className="form-group"><label>Joining Date *:</label><input name="joining_date" type="date" className="form-control" onChange={handleInputChange} value={formData.joining_date} required /></div>
                            <div className="form-group">
                                <label>Department:</label>
                                <select name="dept_id" className="form-control" onChange={handleInputChange} value={formData.dept_id}>
                                    <option value="">-- Select --</option>
                                    {masters.departments.map(d => <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Designation:</label>
                                <select name="designation_id" className="form-control" onChange={handleInputChange} value={formData.designation_id}>
                                    <option value="">-- Select --</option>
                                    {masters.designations.map(d => <option key={d.designation_id} value={d.designation_id}>{d.designation_name}</option>)}
                                </select>
                            </div>
                            <div className="form-group"><label>Work Email:</label><input name="work_email" type="email" className="form-control" onChange={handleInputChange} value={formData.work_email} /></div>
                            <div className="form-group"><label>Mobile (Pri):</label><input name="mobile_primary" type="text" className="form-control" onChange={handleInputChange} value={formData.mobile_primary} /></div>
                        </div>
                    </div>
                );
            case 'PERSONAL':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <div className="form-group">
                                <label>Marital Status:</label>
                                <select name="marital_status" className="form-control" onChange={handleInputChange} value={formData.marital_status}>
                                    <option value="SINGLE">SINGLE</option><option value="MARRIED">MARRIED</option>
                                </select>
                            </div>
                            <div className="form-group"><label>Religion:</label><input name="religion" type="text" className="form-control" onChange={handleInputChange} value={formData.religion} /></div>
                            <div className="form-group"><label>Blood Group:</label><input name="blood_group" type="text" className="form-control" onChange={handleInputChange} value={formData.blood_group} placeholder="e.g. O+" /></div>
                        </div>
                        <div>
                            <div className="form-group"><label>National ID (Aadhar):</label><input name="national_id_number" type="text" className="form-control" onChange={handleInputChange} value={formData.national_id_number} /></div>
                            <div className="form-group"><label>Emerg. Contact Name:</label><input name="emergency_name" type="text" className="form-control" onChange={handleInputChange} value={formData.emergency_name} /></div>
                            <div className="form-group"><label>Emerg. Relation:</label><input name="emergency_relationship" type="text" className="form-control" onChange={handleInputChange} value={formData.emergency_relationship} /></div>
                            <div className="form-group"><label>Emerg. Phone:</label><input name="emergency_phone" type="text" className="form-control" onChange={handleInputChange} value={formData.emergency_phone} /></div>
                        </div>
                    </div>
                );
            case 'BANK':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <div className="form-group"><label>Bank Name:</label><input name="bank_name" type="text" className="form-control" onChange={handleInputChange} value={formData.bank_name} /></div>
                            <div className="form-group"><label>Branch Name:</label><input name="branch_name" type="text" className="form-control" onChange={handleInputChange} value={formData.branch_name} /></div>
                            <div className="form-group"><label>A/C Holder Name:</label><input name="account_holder_name" type="text" className="form-control" onChange={handleInputChange} value={formData.account_holder_name} /></div>
                        </div>
                        <div>
                            <div className="form-group"><label>Account Number:</label><input name="account_number" type="text" className="form-control" onChange={handleInputChange} value={formData.account_number} /></div>
                            <div className="form-group"><label>IFSC Code:</label><input name="ifsc_code" type="text" className="form-control" onChange={handleInputChange} value={formData.ifsc_code} /></div>
                        </div>
                    </div>
                );
            case 'STATUTORY':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <div className="form-group"><label>PAN Number:</label><input name="pan_number" type="text" className="form-control" onChange={handleInputChange} value={formData.pan_number} /></div>
                            <div className="form-group"><label>PF Number:</label><input name="pf_number" type="text" className="form-control" onChange={handleInputChange} value={formData.pf_number} /></div>
                            <div className="form-group"><label>ESI Number:</label><input name="esi_number" type="text" className="form-control" onChange={handleInputChange} value={formData.esi_number} /></div>
                        </div>
                    </div>
                );
            case 'EDUCATION':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <div className="form-group"><label>Degree/Qualification:</label><input name="degree_name" type="text" className="form-control" onChange={handleInputChange} value={formData.degree_name} /></div>
                            <div className="form-group"><label>Institution/University:</label><input name="institution" type="text" className="form-control" onChange={handleInputChange} value={formData.institution} /></div>
                            <div className="form-group"><label>Specialization:</label><input name="specialization" type="text" className="form-control" onChange={handleInputChange} value={formData.specialization} /></div>
                        </div>
                        <div>
                            <div className="form-group"><label>Year of Passing:</label><input name="year_of_passing" type="number" className="form-control" onChange={handleInputChange} value={formData.year_of_passing} /></div>
                            <div className="form-group"><label>Percentage / CGPA:</label><input name="percentage_cgpa" type="number" step="0.01" className="form-control" onChange={handleInputChange} value={formData.percentage_cgpa} /></div>
                        </div>
                    </div>
                );
            case 'EXPERIENCE':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <div className="form-group"><label>Previous Company:</label><input name="company_name" type="text" className="form-control" onChange={handleInputChange} value={formData.company_name} /></div>
                            <div className="form-group"><label>Designation:</label><input name="previous_designation" type="text" className="form-control" onChange={handleInputChange} value={formData.previous_designation} /></div>
                            <div className="form-group"><label>Reason for Leaving:</label><input name="reason_for_leaving" type="text" className="form-control" onChange={handleInputChange} value={formData.reason_for_leaving} /></div>
                        </div>
                        <div>
                            <div className="form-group"><label>From Date:</label><input name="exp_from_date" type="date" className="form-control" onChange={handleInputChange} value={formData.exp_from_date} /></div>
                            <div className="form-group"><label>To Date:</label><input name="exp_to_date" type="date" className="form-control" onChange={handleInputChange} value={formData.exp_to_date} /></div>
                        </div>
                    </div>
                );
        }
    }

    const renderForm = () => (
        <form onSubmit={handleSubmit} style={{ background: '#E8E8E8', padding: '15px', border: '1px solid #AAA' }}>
            <div style={{ marginBottom: '15px', display: 'flex', gap: '5px', borderBottom: '2px solid #CCC', paddingBottom: '5px', flexWrap: 'wrap' }}>
                <button type="button" className="btn-legacy" style={{ background: formTab === 'OFFICIAL' ? '#003366' : '', color: formTab === 'OFFICIAL' ? 'white' : '' }} onClick={() => setFormTab('OFFICIAL')}>Official Info</button>
                <button type="button" className="btn-legacy" style={{ background: formTab === 'PERSONAL' ? '#003366' : '', color: formTab === 'PERSONAL' ? 'white' : '' }} onClick={() => setFormTab('PERSONAL')}>Personal & Emerg.</button>
                <button type="button" className="btn-legacy" style={{ background: formTab === 'BANK' ? '#003366' : '', color: formTab === 'BANK' ? 'white' : '' }} onClick={() => setFormTab('BANK')}>Bank Details</button>
                <button type="button" className="btn-legacy" style={{ background: formTab === 'STATUTORY' ? '#003366' : '', color: formTab === 'STATUTORY' ? 'white' : '' }} onClick={() => setFormTab('STATUTORY')}>Statutory (PF/ESI)</button>
                <button type="button" className="btn-legacy" style={{ background: formTab === 'EDUCATION' ? '#003366' : '', color: formTab === 'EDUCATION' ? 'white' : '' }} onClick={() => setFormTab('EDUCATION')}>Education</button>
                <button type="button" className="btn-legacy" style={{ background: formTab === 'EXPERIENCE' ? '#003366' : '', color: formTab === 'EXPERIENCE' ? 'white' : '' }} onClick={() => setFormTab('EXPERIENCE')}>Experience</button>
            </div>
            
            {renderFormContent()}

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', paddingTop: '10px', borderTop: '1px solid #CCC' }}>
                <button type="submit" className="btn-legacy" style={{ background: '#115522', color: 'white', fontWeight: 'bold' }}>SAVE FULL RECORD</button>
                <button type="button" className="btn-legacy" onClick={() => setActiveTab('LIST')}>CANCEL</button>
            </div>
        </form>
    );

    return (
        <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRP001 - COMPREHENSIVE EMPLOYEE MASTER
            </h3>
            {activeTab === 'LIST' ? renderList() : renderForm()}
        </div>
    );
};

export default EmployeeRegistry;
