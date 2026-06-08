import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { mastersApi, tasksApi } from '../services/api';

interface LeaveRequest {
    leave_id: number;
    employee_number: string;
    employee_name: string;
    leave_type_name: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
}

const LeaveProcessingView = () => {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({
        emp_id: '',
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: ''
    });

    useEffect(() => {
        fetchRequests();
        fetchMasters();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await tasksApi.getLeaveRequests();
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMasters = async () => {
        try {
            const [types, emps] = await Promise.all([
                tasksApi.getLeaveTypes(),
                mastersApi.getEmployees()
            ]);
            setLeaveTypes(types.data);
            setEmployees(emps.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await tasksApi.submitLeave(formData);
            alert('Leave request submitted!');
            setShowForm(false);
            fetchRequests();
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        if (!window.confirm(`Mark this request as ${status}?`)) return;
        try {
            await tasksApi.updateLeaveStatus(id, status, 1); // Mock admin_id = 1
            alert(`Request ${status.toLowerCase()}`);
            fetchRequests();
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRP007 - LEAVE APPLICATION & PROCESSING
            </h3>

            {!showForm ? (
                <div>
                    <button className="btn-legacy" onClick={() => setShowForm(true)} style={{ marginBottom: '10px' }}>
                        + SUBMIT NEW LEAVE
                    </button>
                    <table className="data-grid">
                        <thead>
                            <tr>
                                <th>EMP NO</th>
                                <th>NAME</th>
                                <th>TYPE</th>
                                <th>FROM</th>
                                <th>TO</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r) => (
                                <tr key={r.leave_id}>
                                    <td>{r.employee_number}</td>
                                    <td>{r.employee_name}</td>
                                    <td>{r.leave_type_name}</td>
                                    <td>{new Date(r.start_date).toLocaleDateString('en-GB')}</td>
                                    <td>{r.end_date ? new Date(r.end_date).toLocaleDateString('en-GB') : '-'}</td>
                                    <td style={{ fontWeight: 'bold' }}>{r.status}</td>
                                    <td>
                                        {r.status === 'PENDING' && (
                                            <>
                                                <button className="btn-legacy" onClick={() => handleStatusUpdate(r.leave_id, 'APPROVED')} style={{ color: 'green', marginRight: '5px' }}>APPV</button>
                                                <button className="btn-legacy" onClick={() => handleStatusUpdate(r.leave_id, 'REJECTED')} style={{ color: 'red' }}>REJ</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && !loading && <tr><td colSpan={7} style={{ textAlign: 'center' }}>No leave requests found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ background: '#E8E8E8', padding: '15px', border: '1px solid #AAA', maxWidth: '600px' }}>
                    <div className="form-group">
                        <label>Employee:</label>
                        <select name="emp_id" className="form-control" onChange={handleInputChange} required>
                            <option value="">Select Employee</option>
                            {employees.map(e => <option key={e.emp_id} value={e.emp_id}>{e.employee_number} - {e.first_name} {e.last_name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Leave Type:</label>
                        <select name="leave_type_id" className="form-control" onChange={handleInputChange} required>
                            <option value="">Select Type</option>
                            {leaveTypes.map(t => <option key={t.leave_type_id} value={t.leave_type_id}>{t.leave_type_name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Start Date:</label>
                        <input name="start_date" type="date" className="form-control" onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>End Date:</label>
                        <input name="end_date" type="date" className="form-control" onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Reason:</label>
                        <textarea name="reason" className="form-control" style={{ width: '300px', height: '60px' }} onChange={handleInputChange}></textarea>
                    </div>
                    <div style={{ marginTop: '15px' }}>
                        <button type="submit" className="btn-legacy" style={{ marginRight: '10px' }}>SUBMIT REQUEST</button>
                        <button type="button" className="btn-legacy" onClick={() => setShowForm(false)}>CANCEL</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default LeaveProcessingView;
