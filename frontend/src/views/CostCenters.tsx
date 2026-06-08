import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { mastersApi } from '../services/api';

interface Department {
    dept_id: number;
    dept_code: string;
    dept_name: string;
    company_context: string;
    cost_center_code: string;
}

const CostCentersView = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        dept_code: '',
        dept_name: '',
        company_context: '',
        cost_center_code: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const res = await mastersApi.getDepartments();
            setDepartments(res.data);
        } catch (err) {
            console.error('Failed to fetch departments', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await mastersApi.createDepartment(formData);
            alert('Department created!');
            setShowForm(false);
            fetchDepartments();
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRP003 - COST CENTER / DEPARTMENT MASTER
            </h3>

            {!showForm ? (
                <div>
                    <button className="btn-legacy" onClick={() => setShowForm(true)} style={{ marginBottom: '10px' }}>
                        + ADD NEW COST CENTER
                    </button>
                    <table className="data-grid">
                        <thead>
                            <tr>
                                <th>DEPT CODE</th>
                                <th>NAME</th>
                                <th>CONTEXT</th>
                                <th>CC CODE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((d) => (
                                <tr key={d.dept_id}>
                                    <td>{d.dept_code}</td>
                                    <td>{d.dept_name}</td>
                                    <td>{d.company_context}</td>
                                    <td>{d.cost_center_code}</td>
                                </tr>
                            ))}
                            {departments.length === 0 && !loading && <tr><td colSpan={4} style={{ textAlign: 'center' }}>No departments found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ background: '#E8E8E8', padding: '15px', border: '1px solid #AAA' }}>
                    <div className="form-group">
                        <label>Dept Code:</label>
                        <input name="dept_code" type="text" className="form-control" onChange={handleInputChange} required placeholder="e.g. TVM-OPS" />
                    </div>
                    <div className="form-group">
                        <label>Dept Name:</label>
                        <input name="dept_name" type="text" className="form-control" onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Company Context:</label>
                        <input name="company_context" type="text" className="form-control" onChange={handleInputChange} required placeholder="e.g. KSRTC-SOUTH" />
                    </div>
                    <div className="form-group">
                        <label>Cost Center Code:</label>
                        <input name="cost_center_code" type="text" className="form-control" onChange={handleInputChange} required />
                    </div>
                    <div style={{ marginTop: '15px' }}>
                        <button type="submit" className="btn-legacy" style={{ marginRight: '10px' }}>SAVE COST CENTER</button>
                        <button type="button" className="btn-legacy" onClick={() => setShowForm(false)}>CANCEL</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CostCentersView;
