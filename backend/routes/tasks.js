const express = require('express');
const router = express.Router();
const db = require('../db');

// Example of a transactional payroll processing route
router.post('/process-payroll', async (req, res) => {
    const { month, year } = req.body;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Create a payroll run record
        const [runResult] = await connection.query(
            'INSERT INTO payroll_runs (payroll_month, payroll_year, status) VALUES (?, ?, ?)',
            [month, year, 'PROCESSED']
        );
        const runId = runResult.insertId;

        // 2. Fetch all active employees
        const [employees] = await connection.query('SELECT emp_id FROM employees WHERE status = "ACTIVE"');

        // 3. Process each employee (Simplified logic)
        for (const emp of employees) {
            // Here you would calculate salary based on salary_master and attendance
            await connection.query(
                'INSERT INTO employee_salary_slips (run_id, emp_id, base_pay, net_pay) VALUES (?, ?, ?, ?)',
                [runId, emp.emp_id, 5000.00, 5000.00] // Mock values for demo
            );
        }

        await connection.commit();
        res.json({ message: 'Payroll processed successfully', run_id: runId });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: 'Payroll processing failed: ' + err.message });
    } finally {
        connection.release();
    }
});

module.exports = router;
