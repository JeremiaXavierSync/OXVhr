const express = require('express');
const router = express.Router();
const db = require('../db');

// Get Monthly Salary Ledger
router.get('/salary-ledger', async (req, res) => {
    const { month, year } = req.query;

    try {
        const [rows] = await db.query(`
            SELECT 
                s.slip_id,
                e.employee_number,
                CONCAT(e.first_name, ' ', e.last_name) as employee_name,
                s.basic_pay,
                s.hra,
                s.conveyance as transport_allowance,
                s.net_pay,
                s.pf_deduction as deductions
            FROM employee_salary_slips s
            JOIN employees e ON s.emp_id = e.emp_id
            JOIN payroll_runs r ON s.run_id = r.run_id
            WHERE r.payroll_month = ? AND r.payroll_year = ?
        `, [month, year]);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
