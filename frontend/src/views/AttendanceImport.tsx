import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { mastersApi, tasksApi } from '../services/api';

interface Employee {
    emp_id: number;
    employee_number: string;
    first_name: string;
    last_name: string;
}

const AttendanceImportView = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        emp_id: '',
        log_date: new Date().toISOString().split('T')[0],
        status: 'PRESENT',
        clock_in: '09:00',
        clock_out: '18:00'
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await mastersApi.getEmployees();
            setEmployees(res.data);
        } catch (err) {
            console.error('Failed to fetch employees', err);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Combine date and time for backend
            const payload = {
                ...formData,
                clock_in: `${formData.log_date} ${formData.clock_in}:00`,
                clock_out: `${formData.log_date} ${formData.clock_out}:00`
            };
            await tasksApi.markAttendance(payload);
            alert('Attendance log updated!');
        } catch (err: any) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRP008 - ATTENDANCE MANUAL IMPORT / ENTRY
            </h3>

            <form onSubmit={handleSubmit} style={{ background: '#E8E8E8', padding: '15px', border: '1px solid #AAA', maxWidth: '500px' }}>
                <div className="form-group">
                    <label>Employee:</label>
                    <select name="emp_id" className="form-control" onChange={handleInputChange} required value={formData.emp_id}>
                        <option value="">Select Employee</option>
                        {employees.map(e => <option key={e.emp_id} value={e.emp_id}>{e.employee_number} - {e.first_name} {e.last_name}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Log Date:</label>
                    <input name="log_date" type="date" className="form-control" onChange={handleInputChange} value={formData.log_date} required />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select name="status" className="form-control" onChange={handleInputChange} value={formData.status}>
                        <option value="PRESENT">PRESENT</option>
                        <option value="ABSENT">ABSENT</option>
                        <option value="LATE">LATE</option>
                        <option value="HALF_DAY">HALF DAY</option>
                    </select>
                </div>
                {formData.status !== 'ABSENT' && (
                    <>
                        <div className="form-group">
                            <label>Clock In:</label>
                            <input name="clock_in" type="time" className="form-control" onChange={handleInputChange} value={formData.clock_in} required />
                        </div>
                        <div className="form-group">
                            <label>Clock Out:</label>
                            <input name="clock_out" type="time" className="form-control" onChange={handleInputChange} value={formData.clock_out} required />
                        </div>
                    </>
                )}
                <div style={{ marginTop: '15px' }}>
                    <button type="submit" className="btn-legacy" disabled={loading} style={{ background: '#003366', color: 'white' }}>
                        {loading ? 'SAVING...' : 'SAVE ATTENDANCE LOG'}
                    </button>
                </div>
            </form>

            <div style={{ marginTop: '20px', fontSize: '11px', color: '#666' }}>
                * Note: Manual entry will overwrite any existing biometric logs for the same day.
            </div>
        </div>
    );
};

export default AttendanceImportView;
