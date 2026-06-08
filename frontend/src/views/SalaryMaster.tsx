import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { mastersApi } from '../services/api';

interface SalaryMaster {
    grade_id: number;
    grade_name: string;
    base_salary: number;
    hra: number;
    conveyance_allowance: number;
    medical_allowance: number;
}

const SalaryMasterView = () => {
    const [masters, setMasters] = useState<SalaryMaster[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        grade_name: '',
        base_salary: '',
        hra: '',
        conveyance_allowance: '',
        medical_allowance: ''
    });

    useEffect(() => {
        fetchMasters();
    }, []);

    const fetchMasters = async () => {
        setLoading(true);
        try {
            const res = await mastersApi.getSalaryMasters();
            setMasters(res.data);
        } catch (err) {
            console.error('Failed to fetch salary masters', err);
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
            await mastersApi.createSalaryMaster(formData);
            alert('Salary grade created!');
            setShowForm(false);
            fetchMasters();
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRP002 - SALARY GRADE MASTER
            </h3>

            {!showForm ? (
                <div>
                    <button className="btn-legacy" onClick={() => setShowForm(true)} style={{ marginBottom: '10px' }}>
                        + DEFINE NEW GRADE
                    </button>
                    <table className="data-grid">
                        <thead>
                            <tr>
                                <th>GRADE</th>
                                <th>BASE SALARY</th>
                                <th>HRA</th>
                                <th>CONVEYANCE</th>
                                <th>MEDICAL</th>
                                <th>TOTAL FIXED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {masters.map((m) => {
                                const total = Number(m.base_salary) + Number(m.hra) + Number(m.conveyance_allowance) + Number(m.medical_allowance);
                                return (
                                    <tr key={m.grade_id}>
                                        <td>{m.grade_name}</td>
                                        <td>{Number(m.base_salary).toLocaleString('en-IN')}</td>
                                        <td>{Number(m.hra).toLocaleString('en-IN')}</td>
                                        <td>{Number(m.conveyance_allowance).toLocaleString('en-IN')}</td>
                                        <td>{Number(m.medical_allowance).toLocaleString('en-IN')}</td>
                                        <td style={{ fontWeight: 'bold' }}>{total.toLocaleString('en-IN')}</td>
                                    </tr>
                                );
                            })}
                            {masters.length === 0 && !loading && <tr><td colSpan={6} style={{ textAlign: 'center' }}>No salary grades defined.</td></tr>}
                        </tbody>
                    </table>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ background: '#E8E8E8', padding: '15px', border: '1px solid #AAA' }}>
                    <div className="form-group">
                        <label>Grade Name:</label>
                        <input name="grade_name" type="text" className="form-control" onChange={handleInputChange} required placeholder="e.g. G1, EXE-1" />
                    </div>
                    <div className="form-group">
                        <label>Base Salary:</label>
                        <input name="base_salary" type="number" className="form-control" onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>HRA:</label>
                        <input name="hra" type="number" className="form-control" onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Conveyance:</label>
                        <input name="conveyance_allowance" type="number" className="form-control" onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Medical:</label>
                        <input name="medical_allowance" type="number" className="form-control" onChange={handleInputChange} required />
                    </div>
                    <div style={{ marginTop: '15px' }}>
                        <button type="submit" className="btn-legacy" style={{ marginRight: '10px' }}>SAVE GRADE</button>
                        <button type="button" className="btn-legacy" onClick={() => setShowForm(false)}>CANCEL</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SalaryMasterView;
