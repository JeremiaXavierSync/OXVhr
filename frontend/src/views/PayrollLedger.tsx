import React from 'react';

const PayrollLedger = () => {
    return (
        <div className="view-container">
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #888', paddingBottom: '5px' }}>
                HRP005 - MONTHLY SALARY LEDGER (AUDIT)
            </h3>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '10px', background: '#E8E8E8', padding: '5px', border: '1px solid #AAA' }}>
                <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ width: '40px' }}>YEAR:</label>
                    <select className="form-control"><option>2024</option></select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ width: '50px' }}>MONTH:</label>
                    <select className="form-control"><option>MAY</option></select>
                </div>
                <button className="btn-legacy">GENERATE REPORT</button>
                <button className="btn-legacy">EXPORT TO XL</button>
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
                        <th>OT PAY</th>
                        <th>DEDUCTIONS</th>
                        <th>NET PAYABLE</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(10)].map((_, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>KSRTC{100 + i}</td>
                            <td>EMPLOYEE {i + 1}</td>
                            <td>5,000.00</td>
                            <td>1,500.00</td>
                            <td>500.00</td>
                            <td>250.00</td>
                            <td>100.00</td>
                            <td style={{ fontWeight: 'bold' }}>7,150.00</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{ background: '#DDD', fontWeight: 'bold' }}>
                        <td colSpan={3} style={{ textAlign: 'right' }}>TOTALS:</td>
                        <td>50,000.00</td>
                        <td>15,000.00</td>
                        <td>5,000.00</td>
                        <td>2,500.00</td>
                        <td>1,000.00</td>
                        <td>71,500.00</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default PayrollLedger;
