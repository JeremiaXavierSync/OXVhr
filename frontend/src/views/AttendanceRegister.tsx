import { useState, useEffect } from 'react';
import { tasksApi } from '../services/api';

interface AttendanceLog {
    log_id: number;
    employee_number: string;
    employee_name: string;
    log_date: string;
    clock_in: string;
    clock_out: string;
    status: string;
}

const AttendanceRegisterView = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [logs, setLogs] = useState<AttendanceLog[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await tasksApi.getAttendanceLogs(month, year);
            setLogs(res.data);
        } catch (err) {
            console.error('Failed to fetch attendance logs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRP009 - MONTHLY ATTENDANCE REGISTER
            </h3>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '10px', background: '#E8E8E8', padding: '5px', border: '1px solid #AAA' }}>
                <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ width: '40px' }}>YEAR:</label>
                    <select className="form-control" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                    </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ width: '50px' }}>MONTH:</label>
                    <select className="form-control" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' }).toUpperCase()}</option>
                        ))}
                    </select>
                </div>
                <button className="btn-legacy" onClick={fetchLogs}>GENERATE REGISTER</button>
            </div>

            <table className="data-grid">
                <thead>
                    <tr>
                        <th>DATE</th>
                        <th>EMP NO</th>
                        <th>EMPLOYEE NAME</th>
                        <th>CLOCK IN</th>
                        <th>CLOCK OUT</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.log_id}>
                            <td>{new Date(log.log_date).toLocaleDateString('en-GB')}</td>
                            <td>{log.employee_number}</td>
                            <td>{log.employee_name}</td>
                            <td>{log.clock_in ? new Date(log.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                            <td>{log.clock_out ? new Date(log.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                            <td style={{ 
                                color: log.status === 'PRESENT' ? 'green' : log.status === 'ABSENT' ? 'red' : 'orange',
                                fontWeight: 'bold'
                            }}>
                                {log.status}
                            </td>
                        </tr>
                    ))}
                    {logs.length === 0 && !loading && <tr><td colSpan={6} style={{ textAlign: 'center' }}>No logs found for selected period.</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceRegisterView;
