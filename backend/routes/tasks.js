const express = require('express');
const router = express.Router();
const db = require('../db');

// Execute Monthly Payroll
router.post('/process-payroll', async (req, res) => {
    const { month, year } = req.body;
    
    if (!month || !year) {
        return res.status(400).json({ error: 'Month and Year are required' });
    }

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Create a payroll run record
        const [runResult] = await connection.query(
            'INSERT INTO payroll_runs (payroll_month, payroll_year, status) VALUES (?, ?, ?)',
            [month, year, 'PROCESSED']
        );
        const runId = runResult.insertId;

        // 2. Fetch all active employees with their salary structure (via designation/grade)
        const [employees] = await connection.query(`
            SELECT e.emp_id, e.employee_number, sm.base_salary, sm.hra, sm.conveyance_allowance, sm.medical_allowance
            FROM employees e
            JOIN designations d ON e.designation_id = d.designation_id
            JOIN salary_master sm ON d.grade_level = sm.grade_name
            WHERE e.status = 'ACTIVE'
        `);

        // 3. Process each employee
        for (const emp of employees) {
            // Fetch attendance for this employee and period (Simplified: count 'PRESENT' days)
            const [attendance] = await connection.query(
                'SELECT COUNT(*) as days_present FROM attendance_logs WHERE emp_id = ? AND MONTH(log_date) = ? AND YEAR(log_date) = ? AND status = "PRESENT"',
                [emp.emp_id, month, year]
            );

            const daysPresent = attendance[0].days_present || 22; // Default to 22 if no logs (for demo)
            const totalDays = 30; // Simplified
            
            // Calculate pro-rated salary
            const proRatedBase = (emp.base_salary / totalDays) * daysPresent;
            const proRatedHra = (emp.hra / totalDays) * daysPresent;
            const proRatedConv = (emp.conveyance_allowance / totalDays) * daysPresent;
            
            const grossPay = proRatedBase + proRatedHra + proRatedConv;
            const pfDeduction = proRatedBase * 0.12; // 12% PF
            const netPay = grossPay - pfDeduction;

            await connection.query(
                `INSERT INTO employee_salary_slips (
                    run_id, emp_id, basic_pay, hra, conveyance, net_pay, pf_deduction
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [runId, emp.emp_id, proRatedBase, proRatedHra, proRatedConv, netPay, pfDeduction]
            );
        }

        await connection.commit();
        res.json({ message: 'Payroll processed successfully', run_id: runId, count: employees.length });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: 'Payroll processing failed: ' + err.message });
    } finally {
        connection.release();
    }
});

module.exports = router;
