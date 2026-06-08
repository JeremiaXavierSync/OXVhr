import { useState } from 'react';
import { tasksApi } from '../services/api';

const PayrollExecutionView = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleRunEngine = async () => {
        if (!window.confirm(`Initiate full payroll run for ${month}/${year}?`)) return;
        
        setLoading(true);
        setResult(null);
        try {
            const res = await tasksApi.processPayroll(month, year);
            setResult(res.data);
            alert('Execution Complete!');
        } catch (err: any) {
            alert('Execution Failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRP010 - PAYROLL CALCULATION ENGINE
            </h3>

            <div style={{ background: '#E8E8E8', padding: '20px', border: '1px solid #AAA', maxWidth: '600px' }}>
                <p style={{ marginBottom: '15px', fontSize: '12px' }}>
                    Select the target period and click 'INITIATE RUN'. This will process pro-rated salaries, HRA, and statutory deductions for all ACTIVE employees.
                </p>

                <div className="form-group">
                    <label>Run Year:</label>
                    <select className="form-control" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Run Month:</label>
                    <select className="form-control" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' }).toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button 
                        className="btn-legacy" 
                        onClick={handleRunEngine} 
                        disabled={loading}
                        style={{ background: '#115522', color: 'white', padding: '5px 20px', fontWeight: 'bold' }}
                    >
                        {loading ? 'PROCESSING ENGINE...' : 'INITIATE PAYROLL RUN'}
                    </button>
                </div>
            </div>

            {result && (
                <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #115522', background: '#F0FFF0' }}>
                    <h4 style={{ color: '#115522' }}>RUN SUCCESSFUL</h4>
                    <p>Execution ID: {result.run_id}</p>
                    <p>Records Processed: {result.count}</p>
                    <p>Timestamp: {new Date().toLocaleString()}</p>
                    <p style={{ fontSize: '11px', marginTop: '10px' }}>* Go to Reports -&gt; Payroll Ledger to audit the details.</p>
                </div>
            )}
        </div>
    );
};

export default PayrollExecutionView;
