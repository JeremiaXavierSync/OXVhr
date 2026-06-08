import { useState, useEffect } from 'react';
import { reportsApi, tasksApi } from '../services/api';

interface SalarySlip {
    slip_id: number;
    employee_number: string;
    employee_name: string;
    basic_pay: number;
    hra: number;
    transport_allowance: number;
    net_pay: number;
    deductions: number;
}

const PayrollLedger = () => {
    const [month, setMonth] = useState(5); // May
    const [year, setYear] = useState(2024);
    const [ledger, setLedger] = useState<SalarySlip[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLedger = async () => {
        setLoading(true);
        try {
            const res = await reportsApi.getSalaryLedger(month, year);
            setLedger(res.data);
        } catch (err) {
            console.error('Failed to fetch ledger', err);
        } finally {
            setLoading(false);
        }
    };

    const handleProcessPayroll = async () => {
        if (!window.confirm(`Are you sure you want to process payroll for ${month}/${year}?`)) return;
        
        try {
            await tasksApi.processPayroll(month, year);
            alert('Payroll processed successfully!');
            fetchLedger();
        } catch (err: any) {
            alert('Error processing payroll: ' + (err.message || 'Unknown error'));
        }
    };

    useEffect(() => {
        fetchLedger();
    }, []);

    const totals = ledger.reduce((acc, curr) => ({
        basic: acc.basic + Number(curr.basic_pay),
        hra: acc.hra + Number(curr.hra),
        transport: acc.transport + Number(curr.transport_allowance),
        deductions: acc.deductions + Number(curr.deductions),
        net: acc.net + Number(curr.net_pay)
    }), { basic: 0, hra: 0, transport: 0, deductions: 0, net: 0 });

    return (
        <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRP005 - MONTHLY SALARY LEDGER (AUDIT)
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
                <button className="btn-legacy" onClick={fetchLedger}>GENERATE REPORT</button>
                <button className="btn-legacy" onClick={handleProcessPayroll} style={{ background: '#28a745', color: 'white' }}>RUN PAYROLL ENGINE</button>
            </div>

            <table className="data-grid">
                <thead>
                    <tr>
                        <th>SL. NO</th>
                        <th>EMP NO</th>
                        <th>EMPLOYEE NAME</th>
                        <th>BASIC PAY</th>
                        <th>HRA</th>
                        <th>TRANS. ALLOW</th>
                        <th>DEDUCTIONS (PF)</th>
                        <th>NET PAYABLE</th>
                    </tr>
                </thead>
                <tbody>
                    {ledger.map((row, i) => (
                        <tr key={row.slip_id}>
                            <td>{i + 1}</td>
                            <td>{row.employee_number}</td>
                            <td>{row.employee_name}</td>
                            <td>{Number(row.basic_pay).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td>{Number(row.hra).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td>{Number(row.transport_allowance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td>{Number(row.deductions).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td style={{ fontWeight: 'bold' }}>{Number(row.net_pay).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>
                    ))}
                    {ledger.length === 0 && !loading && <tr><td colSpan={8} style={{ textAlign: 'center' }}>No records found for this period. Click 'RUN PAYROLL ENGINE' to process.</td></tr>}
                </tbody>
                {ledger.length > 0 && (
                    <tfoot>
                        <tr style={{ background: '#DDD', fontWeight: 'bold' }}>
                            <td colSpan={3} style={{ textAlign: 'right' }}>TOTALS:</td>
                            <td>{totals.basic.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td>{totals.hra.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td>{totals.transport.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td>{totals.deductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td>{totals.net.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default PayrollLedger;
